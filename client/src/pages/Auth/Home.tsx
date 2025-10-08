import Div from "../../components/Html/Div/Div";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";

const Home: React.FC = () => {

    return (
        <Div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
            <Navbar />
            <Header />
        </Div>
    )

}

export default Home