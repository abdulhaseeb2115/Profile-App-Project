import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavBar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser } from "../../features/userSlice";
import { signOut } from "firebase/auth";
// firebase imports
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import ViewUsers from "../ViewOverlays/ViewUsers/ViewUsers";
import Backdrop from "../Backdrop/Backdrop";



const Navbar = () => {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const { user, loading } = useSelector(selectUser);
    const [searchQuery, setSearchQuery] = useState("");

    const [users, setUsers] = useState([]);
    const [viewUsers, setViewUsers] = useState(false);

    const [image, setImage] = useState("");

    const search = async (e) => {
        e.preventDefault();

        const querySnapshot = await getDocs(
            query(
                collection(db, "users"),
                where("name", ">=", searchQuery),
                where("name", "<=", searchQuery + '~'),
            )
        );

        if (querySnapshot.docs.length === 0) {
            alert("No User Found !")
            return;
        }

        var userTempArr = [];
        querySnapshot.docs.map(
            (doc) => (
                userTempArr.push(doc.data())
            )
        )
        setUsers(userTempArr);
        setViewUsers(true);
    }


    useEffect(() => {
        const getUserData = async () => {
            if (!user) {
                return;
            };
            // fetch user data
            const querySnapshot = await getDocs(
                query(
                    collection(db, "users"),
                    where("user_id", "==", user.uid)
                )
            );
            // console.log(querySnapshot.docs[0].data())
            setImage(querySnapshot.docs[0].data().image);
        }
        getUserData();
    }, [user])


    return (
        <>
            {
                viewUsers &&
                <>
                    <Backdrop />
                    <ViewUsers users={users} setViewUsers={setViewUsers} />
                </>
            }

            <NavBar collapseOnSelect expand="md" bg="white" variant="white">


                <Container fluid>
                    <NavBar.Brand href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate("/");
                    }}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRD9watd98GuxuplYkqW5OizlYfQa_Iy4_3g&usqp=CAU"
                            alt=""
                            height={"30px"}
                            width={"30px"}
                        />
                    </NavBar.Brand>
                    <NavBar.Toggle aria-controls="responsive-NavBar-nav" />

                    <NavBar.Collapse id="responsive-NavBar-na">
                        <Form
                            className="mt-2 mx-auto col-8 m-md-0 d-flex col-md-2"
                            onSubmit={(e) => search(e)}
                        >
                            <Form.Control
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="sm"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                        </Form>

                        <Nav className="my-2 col-8 col-md-auto mx-auto m-md-0 ms-md-auto d-flex align-items-center">
                            {
                                user ?
                                    <>
                                        {/* image */}
                                        <div
                                            className="rounded-circle overflow-hidden bg-light d-none d-md-flex flex-column align-items-center"
                                            style={{ width: "30px", height: "30px" }}
                                        >
                                            <img
                                                className="h-100 w-auto"
                                                src={image ? image : "../profile.png"}
                                                alt={"User_Image"}
                                            />
                                        </div>

                                        <NavDropdown title="Account" id="collasible-nav-dropdown">

                                            <NavDropdown.Item
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/account");
                                                }}
                                            >
                                                My Account
                                            </NavDropdown.Item>

                                            <NavDropdown.Item
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/profile");
                                                }}
                                            >
                                                My Profile

                                            </NavDropdown.Item>

                                            <NavDropdown.Divider />

                                            <NavDropdown.Item
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    signOut(auth).then(() => {
                                                        dispatch(logOut())
                                                        navigate("/");
                                                    }).catch((error) => {
                                                        alert(`* ${error}`)
                                                    });
                                                }}
                                            >
                                                Logout
                                            </NavDropdown.Item>

                                        </NavDropdown>
                                    </>
                                    :
                                    <>
                                        <a
                                            href="#1"
                                            className="m-0 text-secondary text-decoration-none"
                                            role="button"
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    navigate("/")
                                                }
                                            }
                                        >
                                            SignIn
                                        </a>
                                        <p className="m-0 mx-1">| </p>
                                        <a
                                            href="#2"
                                            className="m-0 text-secondary text-decoration-none"
                                            role="button"
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    navigate("/register")
                                                }
                                            }
                                        >
                                            SignUp
                                        </a>
                                    </>
                            }
                        </Nav>
                    </NavBar.Collapse>
                </Container>
            </NavBar>
        </>
    );
};

export default Navbar;
