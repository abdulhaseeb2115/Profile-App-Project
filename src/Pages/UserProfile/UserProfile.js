import React, { useEffect, useState } from "react";
import Project from "../../Components/Project/Project";
import Backdrop from "../../Components/Backdrop/Backdrop";
import { useSelector } from "react-redux";
// react router dom
import { selectUser } from "../../features/userSlice";
import { useParams } from 'react-router-dom';
// firebase imports
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import ViewResume from "../../Components/ViewOverlays/ViewResume/ViewResume";
import ViewContact from "../../Components/ViewOverlays/ViewContact/ViewContact";
import Loader from "../../Components/Loader/Loader";



const UserProfile = () => {
    let params = useParams();
    const { user, loading } = useSelector(selectUser);


    // profile data
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [resume, setResume] = useState("");


    // projects data
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [projects, setProjects] = useState([]);

    // reume , contact toggle
    const [viewResume, setViewResume] = useState(false);
    const [viewContact, setViewContact] = useState(false);


    useEffect(() => {
        const getUserData = async () => {
            // console.log("-->" + params.id)
            const querySnapshot = await getDocs(
                query(
                    collection(db, "users"),
                    where("user_id", "==", params.id)
                )
            );
            // console.log(querySnapshot.docs[0].data)
            setName(querySnapshot.docs[0].data().name);
            setImage(querySnapshot.docs[0].data().image);
            setDescription(querySnapshot.docs[0].data().description);
            setEmail(querySnapshot.docs[0].data().email);
            setPhone(querySnapshot.docs[0].data().phone);
            setLinkedIn(querySnapshot.docs[0].data().linkedIn);
            setResume(querySnapshot.docs[0].data().resume)
        };

        const getUserProjects = async () => {
            const querySnapshot = await getDocs(
                query(
                    collection(db, "projects"),
                    where("created_by", "==", params.id)
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
        };


        getUserData();
        getUserProjects();
        return () => {
            console.log("");
        }
    }, [params.id]);



    return (
        loading === true ?
            <Loader />
            :
            <div className="UserProfile">

                {   //view resume
                    viewResume && (
                        <>
                            <Backdrop />
                            <ViewResume resume={resume} setViewResume={setViewResume} />
                        </>
                    )
                }

                {   //view contact
                    viewContact && (
                        <>
                            <Backdrop />
                            <ViewContact contact={{ email, phone, linkedIn }} setViewContact={setViewContact} />
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
                            src={image !== "" ? image : "profile.png"}
                            alt={"User_Image"}
                        />
                    </div>

                    {/* decription */}
                    <p className="mt-3 col-8 text-center">{description}</p>

                    {/* follow icon */}
                    {
                        user &&
                        <button className="btn btn-sm rounded-0 btn-light border py-0 position-absolute top-0 end-0 me-5 mt-4">Follow</button>
                    }

                    <div className="position-absolute top-0 start-0 ms-5 mt-4">
                        <button
                            className="btn btn-sm rounded-0 btn-light border py-0 me-4"
                            onClick={() => setViewContact(true)}
                        >
                            Contact
                        </button>
                        <button
                            className="btn btn-sm rounded-0 btn-light border py-0"
                            onClick={() => setViewResume(true)}
                        >
                            View Resume
                        </button>
                    </div>
                </div>

                {/* FEATURED PROJECTS SECTION */}
                <div className="container col-11 my-3 py-3 px-4 rounded-4 border position-relative bg-white">

                    {/* heading */}
                    <h3 className="container-fluid mb-3">Featured Projects</h3>

                    {/* projects */}
                    <div className="d-flex justify-content-center justify-content-md-around flex-wrap p-5">
                        {
                            featuredProjects.length > 0
                                ?
                                featuredProjects.map(({ doc_id, doc_data }) => (
                                    <Project
                                        key={doc_id}
                                        docId={doc_id}
                                        project={doc_data}
                                        allowEdit={false}
                                    />
                                ))
                                :
                                <h3 style={{ textAlign: "center", color: "#CED0D4", marginTop: "50px" }}>No Project Found !</h3>
                        }
                    </div>
                </div>

                {/* PROJECTS SECTION */}
                <div className="container col-11 my-3 py-3 px-4 rounded-4 border position-relative bg-white">
                    {/* edit icon */}

                    {/* heading */}
                    <h3 className="container-fluid mb-3">Projects</h3>

                    {/* projects */}
                    <div className="d-flex justify-content-center justify-content-md-equal flex-wrap p-5">
                        {
                            projects.length > 0
                                ?
                                projects.map(({ doc_id, doc_data }) => (
                                    <Project
                                        key={doc_id}
                                        docId={doc_id}
                                        project={doc_data}
                                        allowEdit={false}
                                    />
                                ))
                                :
                                <h3 style={{ textAlign: "center", color: "#CED0D4", marginTop: "50px" }}>No Project Found !</h3>
                        }
                    </div>
                </div>
            </div>
    );
};

export default UserProfile;
