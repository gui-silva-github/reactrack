import { useTranslation } from "react-i18next"
import Div from "@/components/Html/Div/Div"
import Paragraph from "@/components/Html/Paragraph/Paragraph"
import styles from "./Error.module.css"

const Error: React.FC = () => {
    const { t } = useTranslation()
    return (
      <Div className={styles.align}>
          <Paragraph text={t('projects.userNotFound')} />
      </Div>
    )
  }
  
  export default Error