import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";
import EditProject from "../../Components/Forms/EditProject/EditProject";
import Backdrop from "../../Components/Backdrop/Backdrop";
import { useSelector } from "react-redux";
// react router dom
import { useParams } from "react-router-dom";
// firebase imports
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../Components/Loader/Loader";
import AddGalleryImage from "../../Components/Forms/AddGalleryImage/AddGalleryImage";

const ProjectPage = () => {
    let params = useParams();
    const { user, loading } = useSelector(selectUser);

    // project data
    const projectId = params.id;
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");
    const [company, setCompany] = useState("");
    const [featured, setFeatured] = useState("");
    const [gallery, setGallery] = useState([]);
    const [createdBy, setCreatedBy] = useState("");


    // toggle forms
    const [editProject, setEditProject] = useState(false);
    const [addImages, setAddImages] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            // fetch user data
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setName(docSnap.data().name);
                setImage(docSnap.data().image);
                setDetails(docSnap.data().details);
                setSummary(docSnap.data().summary);
                setCompany(docSnap.data().company);
                setFeatured(docSnap.data().is_featured);
                setCreatedBy(docSnap.data().created_by);
                var tempGallery = [];
                docSnap.data().gallery.map((image_desc) =>
                    tempGallery.push(image_desc)
                );
                setGallery(tempGallery);
            } else {
                console.log("Document does not exist !");
            }
        };

        getUserData();
        return () => {
            console.log("");
        };
    }, [projectId, editProject, addImages]);




    return (
        loading === true ?
            <Loader />
            :
            <div className="Profile">
                {
                    //edit project
                    editProject !== false && (
                        <>
                            <Backdrop />
                            <EditProject
                                project={{
                                    name: name, image: image, summary: summary, details: details, company: company, is_featured: featured, docId: projectId
                                }}
                                userId={user.uid}
                                setEditProject={setEditProject}
                            />
                        </>
                    )
                }
                {
                    //add images
                    addImages !== false && (
                        <>
                            <Backdrop />
                            <AddGalleryImage
                                index={addImages}
                                userId={user.uid}
                                projectId={params.id}
                                userName={user.name}
                                oldGallery={gallery}
                                gallery={gallery}
                                setAddImages={setAddImages}
                                setAllowEdit={setAllowEdit}
                            />
                        </>
                    )
                }

                {/* PROJECT SECTION */}
                <div className="container col-11 my-3 p-3 pb-4 rounded-4 border position-relative bg-white">
                    {/* Name */}
                    <h2 className="ms-5 mb-5 fw-bold">{name}</h2>

                    <div className="col-12 px-5 d-flex flex-wrap">
                        {/* image */}
                        <div className="col-12 col-md-6 d-flex justify-content-center">
                            <span
                                className="rounded-4 overflow-hidden bg-light d-flex flex-column align-items-center"
                                style={{ width: "25vmax", height: "25vmax" }}
                            >
                                <img
                                    className="h-100 w-auto"
                                    src={image !== "" ? image : "profile.png"}
                                    alt={"User_Image"}
                                />
                            </span>
                        </div>

                        <div className="col-12 col-md-6 mt-3 ps-2 mt-ms-0 d-flex flex-column justify-content-between">
                            <div className="conatiner">
                                <h5>Description</h5>
                                <p>{details}</p>
                            </div>

                            <div className="conatiner">
                                <h5>Company</h5>
                                <p>{company}</p>
                            </div>

                        </div>
                    </div>

                    {/* edit icon */
                        (user && (createdBy === user.uid)) &&
                        <TbEdit
                            className="position-absolute"
                            size="30px"
                            style={{ top: "10px", right: "20px" }}
                            onClick={() => setEditProject(true)}
                            role="button"
                        />
                    }
                </div>


                {/* GALLERY SECTION */}
                <div className="container col-11 my-3 py-3 px-4 rounded-4 border position-relative bg-white">

                    {/* edit icon */
                        (user && (createdBy === user.uid)) &&
                        <IoAddCircleOutline
                            className="position-absolute"
                            size="30px"
                            style={{ top: "10px", right: "20px" }}
                            onClick={() => {
                                if (allowEdit) {
                                    setAllowEdit(false)
                                } else {
                                    setAllowEdit(true)
                                }
                            }}
                            role="button"
                        />
                    }

                    {/* heading */}
                    <h3 className="container-fluid mb-3">Gallery</h3>


                    {/* images */}
                    <div className="d-flex justify-content-center justify-content-md-equal flex-wrap p-5">
                        {
                            (user && (createdBy === user.uid)) ?
                                (gallery.length > 0 ?
                                    <>
                                        {[...Array(6)].map((x, i) => (
                                            <div className="col-12 my-2 col-md-4 d-flex justify-content-center">
                                                <div
                                                    className="m-2 rounded-4 border overflow-hidden d-flex flex-column align-items-center position-relative"
                                                    style={{ width: "15vmax", height: "15vmax" }}
                                                    key={i}
                                                >
                                                    {allowEdit && <div className="position-absolute rounded-4 top-0 start-0 h-100 w-100 bg-white opacity-50 d-flex align-items-center justify-content-center p-0 m-0"
                                                        onClick={() => setAddImages(i)}
                                                    >
                                                        <h1 style={{ fontSize: "50px" }} className="p-0 m-0 opacity-75 pb-2">+</h1>
                                                    </div>
                                                    }

                                                    <img
                                                        className="h-100 w-auto"
                                                        src={gallery[i].img ? gallery[i].img : "../noImage.png"}
                                                        alt="gallery_image"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <h3
                                        style={{
                                            textAlign: "center",
                                            color: "#CED0D4",
                                            marginTop: "50px",
                                        }}
                                    >
                                        No Image Found !
                                    </h3>
                                )
                                :
                                (gallery.length > 0 ?
                                    <>
                                        {gallery.map(({ img }, i) => (
                                            img &&
                                            <div className="col-12 my-2 col-md-4 d-flex justify-content-center">
                                                <div
                                                    className="m-2 rounded-4 border overflow-hidden d-flex flex-column align-items-center position-relative"
                                                    style={{ width: "18vmax", height: "18vmax" }}
                                                    key={i}
                                                >
                                                    <img
                                                        className="h-100 w-auto"
                                                        src={img}
                                                        alt="gallery_image"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <h3
                                        style={{
                                            textAlign: "center",
                                            color: "#CED0D4",
                                            marginTop: "50px",
                                        }}
                                    >
                                        No Image Found !
                                    </h3>
                                )
                        }

                    </div>
                </div>
            </div>
    );
};

export default ProjectPage;
