<?php

namespace App\Repositories;


use App\Http\Resources\ChartCollection;
use App\Http\Resources\ChartDetailResource;
use App\Http\Resources\ChartResource;
use App\Models\Chart;
use DB;

class ChartRepository
{
    private $model;
    private $new_chart_details_ids;

    public function __construct(Chart $chart)
    {
        $this->model = $chart;
        $this->new_chart_details_ids =[];
    }

    public function get_all($show_data_options)
    {
        $chart = Chart::query();
        if (isset($show_data_options['company_id'])) {
            $chart->where('company_id', $show_data_options['company_id']);
        }
        if (isset($show_data_options['status'])) {
            $chart->where('status', $show_data_options['status']);
        }
        if (isset($show_data_options['title'])) {
            $chart->where('title', 'like', '%'.$show_data_options['title'].'%');
        }
        if (isset($show_data_options['apply_date'])) {
            $chart->where('apply_date', $show_data_options['apply_date']);
        }

        return new ChartCollection($chart->paginate($show_data_options['per_page'] ?? 10));
    }

    public function create($data)
    {
        $current_chart = $this->model->where('company_id', $data['company_id'])->count();
        if (!$current_chart) {
            $data['title'] = __('nasr.ChartFounded');
            $data['apply_date'] = $this->cal_apply_date_by_company($data['company_id']);
        }
        if (isset($data['contract_id'])) {
            $current_project_chart = $this->model->where('company_id', $data['company_id'])->where('contract_id', $data['contract_id'])->count();
            if (!$current_project_chart) {
                $target_company = resolve(ContractRepository::class)->getByid($data['contract_id']);
                $data['title'] = __('nasr.ChartAttached') . ' ' . $target_company->subject;
                $data['apply_date'] = $target_company->start_date;
            }
        }
        $new_chart = $this->model->create($data);
        $chartDetailRepo = resolve(ChartDetailRepository::class);
        $new_chart_detail = $chartDetailRepo->create([
            'chart_id' => $new_chart->id,
            'job_social_security_id' => $data['chart_details']['job_social_security_id'],
            'count' => $data['chart_details']['count'],
        ]);

        foreach ($data['chart_details']['children'] as $chartDetail) {
            $this->create_chart_detail_node($new_chart->id, $new_chart_detail, $chartDetail);
        }
        return null;
    }

    private function create_chart_detail_node($chart_id, $parent, $chartDetailParent)
    {
        $chartDetailRepo = resolve(ChartDetailRepository::class);
        $new_chart_detail = $chartDetailRepo->create([
            'chart_id' => $chart_id,
            'job_social_security_id' => $chartDetailParent['job_social_security_id'],
            'count' => $chartDetailParent['count'],
            'parent' => $parent->id
        ]);

        if(array_key_exists('children', $chartDetailParent)) {
            foreach ($chartDetailParent['children'] as $chartDetail) {
                return $this->create_chart_detail_node($chart_id, $new_chart_detail, $chartDetail);
            }
        }
        return null;
    }

    private function cal_apply_date_by_company($company_id)
    {

        return resolve(CompanyRepository::class)->getByid($company_id)->register_date;

    }

    public function show($chartId)
    {
        $chart = $this->model->with(['contract', 'company', 'chart_details.job_social_security.job', 'chart_details.personnel'])->findOrFail($chartId);
        $chart->chart_details = $this->createTreeFromChart($chart->chart_details);
        return new ChartResource($chart);
    }

    public function getById($chartId)
    {
        return $this->model->findOrFail($chartId);
    }

    public function update($chartId, $data)
    {
        DB::transaction(function() use($chartId, $data) {
            $chart = $this->getById($chartId);
            $chart->update($data);
            $chartDetailRepo = resolve(ChartDetailRepository::class);
            if (isset($data['chart_details']['id'])) {
                $chart_detail = $chartDetailRepo->getById($data['chart_details']['id']);
                if($chart_detail->chart_id != $chartId){
                    throw \Illuminate\Validation\ValidationException::withMessages(['chart_id.id' => __('messages.invalid_chart_detail_id')]);
                }
                $chart_detail->update([
                    'chart_id' => $chart->id,
                    'job_social_security_id' => $data['chart_details']['job_social_security_id'],
                    'count' => $data['chart_details']['count'],
                ]);
            } else {
                $chart_detail = $chartDetailRepo->create([
                    'chart_id' => $chart->id,
                    'job_social_security_id' => $data['chart_details']['job_social_security_id'],
                    'count' => $data['chart_details']['count'],
                ]);
            }
            $this->new_chart_details_ids[] = $chart_detail->id;
            foreach ($data['chart_details']['children'] as $chartDetail) {
                $this->update_chart_detail_node($chart->id, $chart_detail, $chartDetail);
            }

            $this->delete_unused_chart_details($chartId);
        });
        return null;
    }

    private function update_chart_detail_node($chart_id, $parent, $chartDetailParent)
    {
        $chartDetailRepo = resolve(ChartDetailRepository::class);

        if(isset($chartDetailParent['id'])){
            echo $chartDetailParent['id'] . "<br />";
            $chart_detail = $chartDetailRepo->getById($chartDetailParent['id']);
            if($chart_detail->chart_id != $chart_id){
                throw \Illuminate\Validation\ValidationException::withMessages(['chart_id.id' => __('messages.invalid_chart_detail_id')]);
            }
            $chart_detail->update([
                'chart_id' => $chart_id,
                'job_social_security_id' => $chartDetailParent['job_social_security_id'],
                'count' => $chartDetailParent['count'],
                'parent' => $parent->id
            ]);
        }else{
            $chart_detail = $chartDetailRepo->create([
                'chart_id' => $chart_id,
                'job_social_security_id' => $chartDetailParent['job_social_security_id'],
                'count' => $chartDetailParent['count'],
                'parent' => $parent->id
            ]);
        }
        $this->new_chart_details_ids[] = $chart_detail->id;
        if(array_key_exists('children', $chartDetailParent)) {
            foreach ($chartDetailParent['children'] as $chartDetail) {
                return $this->update_chart_detail_node($chart_id, $chart_detail, $chartDetail);
            }
        }
        return null;
    }

    private function delete_unused_chart_details($chart_id){

        $chartDetailRepo = resolve(ChartDetailRepository::class);
        $total_ids = $chartDetailRepo->getChartDetailIdsByChartId($chart_id);

        $old_chart_detail = array_diff($total_ids, $this->new_chart_details_ids);

        foreach ($old_chart_detail as $ocd){
            $chartDetailRepo->delete($ocd);
        }

        return null;
    }

    public function delete($chartId): bool
    {

        $chart = $this->getById($chartId);
        if ($chart->status > 0) {
            return false;
        }
        if ($chart->chart_details()->exists()) {
            return false;
        }
        return $chart->delete();

    }

    public function clone($chartId)
    {

        $chart = $this->model->with('chart_details')->findOrFail($chartId);

        if ($chart->status < 3) {
            return false;
        }

        $new_chart = $chart->replicate();
        $new_chart->title = __('nasr.edited') . $chart->title;
        $new_chart->status = 0;
        $new_chart->push();

        foreach ($chart->chart_details as $chart_detail) {
            $new_chart_detail = $chart_detail->replicate();
            $new_chart_detail = $new_chart->chart_details()->save($new_chart_detail);
            foreach ($chart_detail->personnel as $personnel) {
                $new_chart_detail->personnel()->attach($personnel->id);
            }
        }

        return new ChartResource($new_chart->load(['contract', 'company', 'chart_details.job_social_security.job', 'chart_details.personnel']));
    }


    private function createTreeFromChart($chartDetails)
    {
        $chartTree = [];
        // determine root tree
        $rootIndex = $this->getRootIndex($chartDetails);
        if ($rootIndex < 0) {
            return $chartTree;
        }

        $chartTree[0] = new ChartDetailResource($chartDetails[$rootIndex]);
        $childrenIndex = $this->getChildrenIndex($chartDetails, $chartDetails[$rootIndex]->id);

        $temp_children = [];
        foreach ($childrenIndex as $childIndex) {
            $temp_children[] = new ChartDetailResource($chartDetails[$childIndex]);
        }
        $chartTree[0]->children = $temp_children;

        foreach ($chartTree[0]->children as $childItem) {
            $this->createChildNode($childItem, $chartDetails);
        }

        return $chartTree;
    }

    private function createChildNode($node, $chartDetails)
    {

        $childrenIndex = $this->getChildrenIndex($chartDetails, $node->id);
        $temp_children = [];
        if ($childrenIndex) {
            $node->children = [];
        }
        foreach ($childrenIndex as $childIndex) {
            $temp_children[] = new ChartDetailResource($chartDetails[$childIndex]);
            $this->createChildNode($chartDetails[$childIndex], $chartDetails);
        }
        $node->children = $temp_children;
    }

    private function getChildrenIndex($chartDetails, $parentId)
    {

        $childrenIndex = [];
        foreach ($chartDetails as $index => $chartDetail) {
            if ($chartDetail->parent === $parentId) {
                $childrenIndex[] = $index;
            }
        }
        return $childrenIndex;
    }

    private function getRootIndex($chartDetails)
    {
        foreach ($chartDetails as $index => $chartDetail) {
            if ($chartDetail->parent === null) {
                return $index;
            }
            return -1; // there is no root
        }
    }

    public function updateStatus($chart, $chartStatus){

        $theChart = $this->getById($chart);
        $theChart->status = $chartStatus['status'];
        $theChart->save();
        return $chart;
    }


}
