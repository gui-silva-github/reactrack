import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import type { IPricesCoinData } from "@/interfaces/systems/crypto"
import Chart from "react-google-charts"

interface ILineChartProps {
    historicalData: IPricesCoinData;
}

const LineChart: React.FC<ILineChartProps> = ({ historicalData }) => {
    const { t } = useTranslation()
    const [data, setData] = useState<[string, string][]>([[t('crypto.chartDataLabel'), t('crypto.chartPriceLabel')]])

    useEffect(() => {
        const dataLabel = t('crypto.chartDataLabel')
        const priceLabel = t('crypto.chartPriceLabel')
        const dataCopy: [string, string | number][] = [[dataLabel, priceLabel]]
        if (historicalData.prices.length > 0) {
            historicalData.prices.map((item: any) => {
                dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0, -5)}`, item[1]])
            })
        }
        setData(dataCopy as [string, string][])
    }, [historicalData, t])

    return (
        <Chart 
            chartType="LineChart"
            data={(data)}
            options={{
                title: t('crypto.chartTitle'),
                curveType: "function",
                legend: { position: "bottom" },
            }}
        />
    )
}
export default LineChart