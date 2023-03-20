import React from 'react';
import { Content} from "adminlte-2-react";
import { withTranslation } from "react-i18next";

const Plurality = ({t}) =>{
    return <Content title={t("NAV_MONITORING_PLURALITY")} browserTitle={t("NAV_MONITORING_PLURALITY")}>
        <iframe width="100%" height="600" src="https://www.surveymonkey.com/r/2ndonee" title={t("NAV_MONITORING_PLURALITY")} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </Content>
}

export default withTranslation()(Plurality);