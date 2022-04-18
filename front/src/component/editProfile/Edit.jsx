import axios from "axios";
import './Edit.css'
import { RiImage2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
// import { AppContext, AppProvider } from "../../context/contextapi"
import { useContext, useState, useEffect } from "react";

export function Edit({ setedit }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [file, setFile] = useState(null);
 
    const navigate = useNavigate();

    const PF = "http://localhost:8800/images/"

    function displayEdit() {

        setedit(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {

        };

        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            updatedUser.profilePic = filename;
            try {
                await axios.post("http://localhost:8800/upload", data);
            } catch (err) { }
        }
        try {

            const res = await axios.put(`http://localhost:8800/updateProfile/${JSON.parse(sessionStorage.getItem("user")).userid}`, updatedUser)
    
            sessionStorage.setItem("userimage" ,res.data.profilePic)
            navigate("/chat")
            setedit(false)
          



        } catch (err) {
            console.log(err)

        }
       

    }

    return (
        <div className='editbox' >
            <div className='editCol1'>
                <div className='ImgSection'>
                    <div className='ImgSectionInner'>
                        <div className='editCircle'>


                            <label htmlFor="fileInput">
                                <RiImage2Fill size={35} className={'imageIcon'}  color={'white'}/>
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            

                        </div>
                  
                    </div>
                    <h2>
                        Change profile img
                    </h2>
         

                </div>
                <div className='InputSection'>
                    <div className='closeButton'>
                        <div onClick={displayEdit}>
                            x
                        </div>

                    </div>

                    <div className='InputSection3'>
                      

                    </div>
                </div>
            </div>
            <div className='editCol2'>

                <div className='EditButton' onClick={handleSubmit}>
                    Update
                </div>
            </div>
        </div>
    )

}