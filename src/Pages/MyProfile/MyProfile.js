import React, { useEffect, useReducer, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";
import EditProfile from "../../Components/Forms/EditProfile/EditProfile";
import Project from "../../Components/Project/Project";
import EditProject from "../../Components/Forms/EditProject/EditProject";
import Backdrop from "../../Components/Backdrop/Backdrop";
import AddProject from "../../Components/Forms/AddProject/AddProject";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
// react router dom
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/userSlice";
// firebase imports
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";




const MyProfile = () => {
    // const [reload, setReload] = useReducer(x => x + 1, 0);

    const navigate = useNavigate();
    const { user, loading } = useSelector(selectUser);
    const [userId, setUserId] = useState(null);

    // profile data
    const [docId, setDocId] = useState(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [description, setDescription] = useState("");

    // projects data
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [projects, setProjects] = useState([]);

    // toggle forms
    const [editProfile, setEditProfile] = useState(false);
    const [editProject, setEditProject] = useState(false);
    const [addFeaturedProject, setAddFeaturedProject] = useState(false);
    const [addProject, setAddProject] = useState(false);



    useEffect(() => {
        const getUserData = async () => {
            setUserId(user.uid);
            // console.log(user.uid)

            // fetch user data
            const querySnapshot = await getDocs(
                query(
                    collection(db, "users"),
                    where("user_id", "==", user.uid)
                )
            );
            // console.log(querySnapshot.docs[0].data())

            setDocId(querySnapshot.docs[0].id);
            setName(querySnapshot.docs[0].data().name);
            setImage(querySnapshot.docs[0].data().image);
            setEmail(querySnapshot.docs[0].data().email);
            setPhone(querySnapshot.docs[0].data().phone);
            setLinkedIn(querySnapshot.docs[0].data().linkedIn);
            setDescription(querySnapshot.docs[0].data().description);
        };

        const getUserProjects = async () => {
            const querySnapshot = await getDocs(
                query(
                    collection(db, "projects"),
                    where("created_by", "==", user.uid),
                    orderBy('date_created', 'desc'),
                )
            );

            var projTempArr = [];
            var featProjTempArr = [];

            querySnapshot.docs.map(
                (doc) => (
                    doc.data().is_featured === false
                        ?
                        projTempArr.push({
                            doc_id: doc.id,
                            doc_data: doc.data(),
                        })
                        :
                        featProjTempArr.push({
                            doc_id: doc.id,
                            doc_data: doc.data(),
                        })
                )
            )

            setProjects(projTempArr);
            setFeaturedProjects(featProjTempArr);

            // querySnapshot.docs.map(
            //     (doc) => (
            //         doc.data().is_featured === false
            //             ?
            //             setProjects((projects) => [...projects, {
            //                 doc_id: doc.id,
            //                 doc_data: doc.data(),
            //             }])
            //             :
            //             setFeaturedProjects((featuredProjects) => [...featuredProjects, {
            //                 doc_id: doc.id,
            //                 doc_data: doc.data(),
            //             }])
            //     )
            // )

        };
        // console.log(featuredProjects)

        if (loading === false) {
            if (user === null) {
                navigate("/");
            }
            else {
                setFeaturedProjects([]);
                setProjects([]);
                getUserData();
                getUserProjects();
                return () => {
                    console.log("");
                }
            }
        }
    }, [user, editProfile, editProject, addProject, addFeaturedProject]);



    return (
        loading === true ?
            <Loader />
            :
            <div className="Profile">
                {
                    //edit profile
                    editProfile && (
                        <>
                            <Backdrop />
                            <EditProfile
                                user={{ docId, name, image, description, email, phone, linkedIn }}
                                setEditProfile={setEditProfile}
                                setNameMain={setName}
                                setImageMain={setImage}
                                setDescriptionMain={setDescription}
                            />
                        </>
                    )
                }

                {
                    //edit project
                    editProject !== false && (
                        <>
                            <Backdrop />
                            <EditProject
                                project={editProject}
                                userId={userId}
                                setEditProject={setEditProject}
                            />
                        </>
                    )
                }

                {
                    //add featured project
                    addFeaturedProject !== false && (
                        <>
                            <Backdrop />
                            <AddProject
                                userId={userId}
                                isFeatured={true}
                                setAddProject={setAddFeaturedProject}
                            />
                        </>
                    )
                }

                {
                    //add project
                    addProject !== false && (
                        <>
                            <Backdrop />
                            <AddProject userId={userId} isFeatured={false} setAddProject={setAddProject} />
                        </>
                    )
                }

                {/* PROFILE SECTION */}
                <div className="container col-11 my-3 p-3 d-flex flex-column align-items-center rounded-4 border position-relative bg-white">
                    {/* Name */}
                    <h2 className="mb-3 fw-bold">{name}</h2>

                    {/* image */}
                    <div
                        className="rounded-circle overflow-hidden bg-light d-flex flex-column align-items-center"
                        style={{ width: "10vmax", height: "10vmax" }}
                    >
                        <img
                            className="h-100 w-auto"
                            src={image ? image : "../profile.png"}
                            alt={"User_Image"}
                        />
                    </div>

                    {/* decription */}
                    <p className="mt-3 col-8 text-center">{description}</p>

                    {/* edit icon */}

                    <TbEdit
                        className="position-absolute"
                        size="30px"
                        style={{ top: "10px", right: "20px" }}
                        onClick={() => setEditProfile(true)}
                        role="button"
                    />
                </div>

                {/* FEATURED PROJECTS SECTION */}
                <div className="container col-11 my-3 py-3 px-4 rounded-4 border position-relative bg-white">
                    {/* edit icon */}
                    <IoAddCircleOutline
                        className="position-absolute"
                        size="30px"
                        style={{ top: "10px", right: "20px" }}
                        onClick={() => setAddFeaturedProject(true)}
                        role="button"
                    />

                    {/* heading */}
                    <h3 className="container-fluid mb-3">Featured Projects</h3>

                    {/* projects */}
                    <div className="row">
                        {
                            featuredProjects.length > 0
                                ?
                                featuredProjects.map(({ doc_id, doc_data }) => (
                                    <div
                                        className="col-12 my-2 col-md-4 d-flex justify-content-center"
                                        key={doc_id}
                                    > <Project
                                            key={doc_id}
                                            docId={doc_id}
                                            allowEdit={true}
                                            project={doc_data}
                                            setEditProject={setEditProject}
                                        />
                                    </div>
                                ))
                                :
                                <h3 style={{ textAlign: "center", color: "#CED0D4", marginTop: "50px" }}>No Project Found !</h3>
                        }
                    </div>
                </div>

                {/* PROJECTS SECTION */}
                <div className="container col-11 my-3 py-3 px-4 rounded-4 border position-relative bg-white">
                    {/* edit icon */}
                    <IoAddCircleOutline
                        className="position-absolute"
                        size="30px"
                        style={{ top: "10px", right: "20px" }}
                        onClick={() => setAddProject(true)}
                        role="button"
                    />

                    {/* heading */}
                    <h3 className="container-fluid mb-3">Projects</h3>

                    {/* projects */}
                    <div className="row">
                        {
                            projects.length > 0
                                ?
                                projects.map(({ doc_id, doc_data }) => (
                                    <div
                                        className="col-12 my-2 col-md-4 d-flex justify-content-center"
                                        key={doc_id}
                                    >
                                        <Project
                                            docId={doc_id}
                                            project={doc_data}
                                            allowEdit={true}
                                            setEditProject={setEditProject}
                                        />
                                    </div>
                                ))
                                :
                                <h3 style={{ textAlign: "center", color: "#CED0D4", marginTop: "50px" }}>No Project Found !</h3>
                        }
                    </div>
                </div>
            </div>
    );
};

export default MyProfile;
