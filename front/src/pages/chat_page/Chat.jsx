import { FiUsers } from 'react-icons/fi';
import { IoIosSend } from 'react-icons/io';
import { Users } from '../../component/usersbox/Users';
import { Prop } from '../../component/Prop/Prop';
import { BiSearchAlt2 } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { AiFillFolderAdd } from 'react-icons/ai';
import { BsFillArrowDownSquareFill } from 'react-icons/bs';
import './Chat.css'
import { Manimes } from '../../component/mainmessagebox/Mainmes';
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import axios from "axios"
import { Edit } from '../../component/editProfile/Edit';
import {AiOutlineArrowLeft} from "react-icons/ai"

export function Chat() {
    const [messages, setMessages] = useState('')
    const [input, setInput] = useState('')
    const [isRender, Setisrendeer] = useState(false)
    const [myId, setMyId] = useState("")
    const [cuFrinend, setcurfrined] = useState()
    const [friendId, setFriendid] = useState("")
    const [diplay, setDisplay] = useState([])
    const [myName, setMyname] = useState(JSON.parse(sessionStorage.getItem("user")).username)
    const [ConName, setconName] = useState("")
    const [messageList, setmessageList] = useState([])
    const [nonCheckMess, setnonCehck] = useState([])
    const [edit, setedit] = useState(false)
    const [search, Setsearch] = useState("")
    const [mobile ,Setmobile] = useState(true)

    const socket = io("http://localhost:8800");

    useEffect(() => {

        setmessageList([])
        setnonCehck([])
        sessionStorage.setItem("curuser", cuFrinend)


        const getcurFrined = async () => {
      
            if (cuFrinend) {
                try {
                    const res = await axios.get(`http://localhost:8800/getfriend/${cuFrinend}`);

                    setFriendid(res.data)

                } catch (err) { console.log(err) }

            }

        };
        getcurFrined()

        const checkCon = async () => {
            if (cuFrinend) {
                try {
                    const res = await axios.get(`http://localhost:8800/test/${cuFrinend}/${myName}`)

                    if (res.data[0] == undefined) {
              
                        try {
                            const newCon = await axios.post('http://localhost:8800/conversation', { first: myName, second: cuFrinend })

                            setconName(newCon.data._id)

                        } catch (err) {
                            console.log(err)
                        

                        }

                    } else {


                        for (let i = 0; i < res.data[0].messages.length; i++) {

                            setmessageList((messageList) => [...messageList, res.data[0].messages[i]]);


                        }


                        setconName(res.data[0]._id)

                    }

                } catch (err) {
                    console.log(err)

                }

            }



        }
        checkCon()

    }, [cuFrinend])


    useEffect(() => {

        socket.on("connect", () => {
            const ChId = async () => {
                try {
                    const res = await axios.put('http://localhost:8800/changeid', { userId: socket.id, mainId: JSON.parse(sessionStorage.getItem("user")).userid });

                } catch (err) {
                    console.log(err)
              
                }
            };

            ChId()

            setMyId(socket.id)

        })

    }, [])


    useEffect(() => {

        socket.on("qebul", (message, myName, cuFrinend) => {
  
           if (sessionStorage.getItem("curuser") == myName) {
                setmessageList((messageList) => [...messageList, { new: message, myName }]);

            } else {
                setnonCehck((nonCheckMess) => [...nonCheckMess, myName])
            }


        });

    })


    useEffect(() => {


        const displayFrined = async () => {

            try {
                const res = await axios.get('http://localhost:8800/getAllfriend');



                if (res.data) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].username !== JSON.parse(sessionStorage.getItem("user")).username) {

                            if (search == "") {
                                setDisplay((diplay) => [...diplay, res.data[i]]);

                            }


                        }


                    }
                }


            } catch (err) { console.log(err) }
        };
        displayFrined()

    }, [])





    function AddMessage() {
   
        setMessages('')

        socket.emit("yenis", messages, friendId, ConName, myName)
        // setmessageList([...messageList,{new:messages ,myName}])
        setmessageList((messageList) => [...messageList, { new: messages, myName }]);



    }

    function changeMode() {
        if (isRender == true) {
            Setisrendeer(false)
        } else {
            Setisrendeer(true)
        }

    }
    useEffect(() => {

        socket.emit("newSocketID", myId, friendId)

    }, [myId])

    useEffect(() => {



        socket.on("acceptId", (myId, friendId) => {

            setFriendid(myId)
            return

        });

    })
    function changeDisplay(){
        Setmobile(true)


    }



    return (
        <div className='backgound'>
            {edit ? <Edit setedit={setedit} propt={diplay} /> : null}

            <div className='chatmain'>
        
                <div className='navbar'>
                    <div className={`searchBar  ${mobile ? "active":"null" }`} >


                        <div>
                            <input placeholder="Search" onChange={(e) => Setsearch(e.target.value)} />


                        </div>


                    </div>
                    <div className={`friendsName  ${mobile ? "active":"null" }`}>
                        <AiOutlineArrowLeft size={25} onClick={changeDisplay}/>
                        <div className='firendname1'>
                            
                            {cuFrinend}
                        </div>
                        <div className='aboutProfofile'>

                            <BsFillArrowDownSquareFill size={25} color={'rgb(83, 83, 204)'} style={{ cursor: 'pointer' }} onClick={changeMode} />

                        </div>

                        {isRender ? <Prop setedit={setedit} /> : null}



                    </div>
                </div>
                <div className='middelePlace'>
                    <div  className={`friends  ${mobile ? "active":"null" }`}>

         


                       {diplay && diplay.filter((val) =>{
                            if(search == ""){
                                return val

                            }else if(val.username.toLowerCase().includes(search.toLocaleLowerCase())){
                                return val

                            }

                        }).map((val ,key) =>{
                            return(
                             
                                  <Users key={key.toString()}  Setmobile={Setmobile}  prop={val} prop2={cuFrinend} prop3={nonCheckMess} setcurfrined={setcurfrined} />

                            )
                        })
                          
                        }


                    </div>
                    <div className={`messages  ${mobile ? "active":"null" }`}>
                        <div className='showMessage'>
                            <Manimes prop={messageList} />

                        </div>
                        <div className='writeMessage'>
                            <div className='writeMessageP1'>
                                <AiFillFolderAdd size={30} color={'rgb(61, 61, 212)'} />


                            </div>
                            <div className='writeMessageP2'>

                                <input value={messages} onChange={(e) => { setMessages(e.target.value) }} placeholder='Type a message' />
                                <div>
                                    <RiSendPlaneFill onClick={AddMessage} color={'white'} size={25} style={{ marginRight: "3.5px", marginTop: "3px" }} />
                                </div>

                            </div>


                        </div>

                    </div>

                </div>
                <div>

                </div>

            </div>
        </div>

    )
}