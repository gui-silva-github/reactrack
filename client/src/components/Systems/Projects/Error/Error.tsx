import { useTranslation } from "react-i18next"
import Div from "../../../Html/Div/Div"
import Paragraph from "../../../Html/Paragraph/Paragraph"
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