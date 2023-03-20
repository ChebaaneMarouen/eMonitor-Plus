import React from 'react';
import { Content} from "adminlte-2-react";
import { withTranslation } from "react-i18next";

const Program = ({t}) =>{
    return <Content title={t("NAV_MONITORING_PROGRAM")} browserTitle={t("NAV_MONITORING_PROGRAM")}>
        <iframe width="100%" height="600" src="https://www.surveymonkey.com/r/1stonee" title={t("NAV_MONITORING_PROGRAM")} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </Content>
}

export default withTranslation()(Program);