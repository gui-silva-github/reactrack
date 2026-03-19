import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Div from "@/components/Html/Div/Div";
import Header1 from "@/components/Html/Header1/Header1";
import './Projects.css'

const ProjectsProvider: React.FC = () => {
    const { t } = useTranslation()
    return (
        <Div className="body app">
            <Header1 text={t('projects.searchProjects')} />
            <Outlet />
        </Div>
    )
} 

export default ProjectsProvider