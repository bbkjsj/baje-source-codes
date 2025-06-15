import React, { useEffect, useState } from "react";
// import {
//   PDFViewer,
//   StyleSheet,
//   Font,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";
// import Peyda from "./../../../../../assets/fonts/other/b_nazanin.ttf";
// import Peyda from "./../../../../../assets/fonts/Peyda/Peyda-Medium/fonts/Peyda-Medium.ttf";
// import PeydaSemiBold from "./../../../../../assets/fonts/Peyda/Peyda-SemiBold/fonts/Peyda-SemiBold.ttf";
// import PeydaBold from "./../../../../../assets/fonts/Peyda/Peyda-Bold/fonts/Peyda-Bold.ttf";
// import PeydaBlack from "./../../../../../assets/fonts/Peyda/Peyda-Black/fonts/Peyda-Black.ttf";
import { useRouteMatch } from "react-router";
import { getAudit } from "modules/hse/api/audit";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import GoBackBtn from "components/GoBackBtn";
import PDFDoucument from "./PDFDocumnet"; // This component will also be stubbed
import { Typography } from "antd";
import useIsMobile from "hooks/useIsMobile"; // Assuming this is a different hook, not the one removed
import AppButton from "components/general/AppButton";
import { dateToJalali } from "_helpers";

// Mock Font object if it's used by PDFDocument or other components
const Font = {
  register: () => {},
  getRegisteredFonts: () => [],
};

const AuditPDFRetport = () => {
  const isMobile = useIsMobile(); // Assuming this is a valid custom hook that remains

  // Font.register({
  //   // src: Peyda,
  //   family: "peyda",
  //   fonts: [
  //     {
  //       src: Peyda,
  //     },
  //     {
  //       src: PeydaSemiBold,
  //       fontStyle: "semibold",
  //     },
  //     {
  //       src: PeydaBold,
  //       fontStyle: "bold",
  //     },
  //     {
  //       src: PeydaBlack,
  //       fontStyle: "black",
  //     },
  //   ],
  // });
  const {
    params: { id: auditId },
  } = useRouteMatch();

  const [state, setState] = useState({
    audit: {
      first_name: "رضا",
      last_name: "قهرمانی",
      national_number: "0014148171",
      personnel_id_fk: 16064,
      image_url: "/api/image/personnel/211130144578.$.jpg",

      id: 96,
      vehicle_id_fk: null,
      environment_id_fk: null,
      audit_date: "2021-12-03T20:30:00.000Z",
      minimum_point: 50,
      description: null,
      date: "2021-12-04T16:23:13.000Z",
      draft: 0,
      organization_code: null,
      plaque1: null,
      plaque2: null,
      plaque3: null,
      plaque4: null,
      operator_first_name: "رضا",
      operator_last_name: "قهرمانی",
      questions: [
        {
          id: 1043,
          audit_id_fk: 96,
          question: "آیا لباس کار بر تن دارد؟",
          question_id_fk: 28,
          answer: "4",
          critical: "",
          weight_factor: 1,
          requirements: null,
          description: null,
          group: "individual",
          type: "yes/no",
          code: "101352",
          is_not_related: null,
        },
      ],
    },
    loading: true,
  });

  useEffect(() => {
    handleLoadAudit();
  }, []);

  const handleLoadAudit = async () => {
    try {
      const { data } = await getAudit(auditId);
      setState((s) => ({
        ...s,
        audit: { ...data.audit, questions: data.questions },
        loading: false,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (state.loading) return <LoadingLogo />;
  if (state.audit.draft === 1)
    return (
      <Typography.Title>
        امکان خروجی گرفتن بازرسی به اتمام نرسیده وجود ندارد
      </Typography.Title>
    );

  // Placeholder for PDFDownloadLink and PDFViewer
  const PDFDownloadLinkPlaceholder = ({ document, fileName, children }) => <div>{children}</div>;
  const PDFViewerPlaceholder = ({ children }) => <div style={{width: '100%', height: '500px', border: '1px solid black', overflow: 'auto'}}>{children}</div>;


  return (
    <>
      <ContentTop
        title="گزارش بازرسی"
        breadcrumbItems={[
          { text: "بازرسی" },
          { text: "لیست بازرسی", link: pageNames.hse.audit.index },
        ]}
      />
      <GoBackBtn />

      {isMobile ? (
        // <PDFDownloadLink
        //   document={<PDFDoucument audit={state.audit} />}
        //   fileName={`audit-report${
        //     state.audit.id ? "-" + state.audit.id : ""
        //   }-${dateToJalali(new Date())}`}
        // >
        //   {({ blob, url, loading, error }) =>
        //     loading ? (
        //       <LoadingLogo />
        //     ) : (
        //       <AppButton
        //         className="mx-auto big-btn mt-3"
        //         variant="primary"
        //         size="large"
        //       >
        //         دانلود فایل PDF
        //       </AppButton>
        //     )
        //   }
        // </PDFDownloadLink>
        <PDFDownloadLinkPlaceholder
          document={<div>PDF Document Placeholder for Download</div>}
          fileName="audit-report.pdf"
        >
           <AppButton
             className="mx-auto big-btn mt-3"
             variant="primary"
             size="large"
           >
             دانلود فایل PDF (Placeholder)
           </AppButton>
        </PDFDownloadLinkPlaceholder>
      ) : (
        // <PDFViewer width="100%" height={isMobile ? 480 : 1500}>
        //   <PDFDoucument audit={state.audit} />
        // </PDFViewer>
        <PDFViewerPlaceholder>
          <PDFDoucument audit={state.audit} /> {/* This will render its placeholder version */}
        </PDFViewerPlaceholder>
      )}
    </>
  );
};

export default AuditPDFRetport;
