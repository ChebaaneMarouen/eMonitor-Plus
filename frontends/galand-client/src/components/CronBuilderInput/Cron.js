import React from "react";
import Cron from "@shared/react-cron-generator/src/lib/cron";
import "react-cron-generator/dist/cron-builder.css";
import { useSelector } from "react-redux";
import { withTranslation } from "react-i18next";

function CronComponent({ onChange, value, t }) {
    const lang = useSelector((state) => state.persistedData.lang);

    return <Cron onChange={onChange} value={value} showResultText={true} t={t} locale={lang} />;
}

export default withTranslation()(CronComponent);
