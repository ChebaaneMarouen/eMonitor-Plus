import React from 'react';
import { Content} from "adminlte-2-react";
import { withTranslation } from "react-i18next";

const ElectoralIrregularities = ({t}) =>{
    return <Content title={t("NAV_MONITORING_ELECTORAL_IRREGULARITIES")} browserTitle={t("NAV_MONITORING_ELECTORAL_IRREGULARITIES")}>
        <iframe width="100%" height="600" src="https://www.surveymonkey.com/r/3rdonee" title={t("NAV_MONITORING_ELECTORAL_IRREGULARITIES")} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </Content>
}

export default withTranslation()(ElectoralIrregularities);