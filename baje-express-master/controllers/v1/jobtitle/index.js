
module.exports = ((app) => {
    let pp = app.get('pool').promise();

    app.get('/api/jobtitle/:code', async (req, res) => {
        var [job] = await pp.query('select id, title from job_title where code = ?', [req.params.code]);
        if(job.length > 0) { 
            res.status(200).send({
                id: job[0].id,
                title: job[0].title,
                code: job[0].code
            });
        }
        else { 
            res.status(403).send('کد وارد شده معتبر نمیباشد');
        }
    });
});