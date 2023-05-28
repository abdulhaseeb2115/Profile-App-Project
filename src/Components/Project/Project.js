import React from 'react';
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const Project = ({ docId, allowEdit, project, setEditProject }) => {
    var projectData = project;
    projectData["docId"] = docId;

    const navigate = useNavigate();

    return (
        <div className='Project text-center position-relative p-0 m-1' style={{ width: "18vmax", minWidth: "200px" }}>
            {/* edit icon */
                allowEdit &&
                <BiDotsHorizontalRounded
                    className="position-absolute"
                    size="20px"
                    style={{ top: "2px", right: "0" }}
                    onClick={() => setEditProject(projectData)}
                    role="button"
                />
            }

            {/* name */}
            <h6 className='p-0 px-3 mb-1'>{project.name}</h6>


            {/* image */}
            <div
                className="rounded-4 overflow-hidden d-flex flex-column align-items-center"
                style={{ width: "18vmax", height: "18vmax", minWidth: "180px", minHeight: "180px" }}
                onClick={
                    () => navigate(`/project/${docId}`)
                }
            >
                <img
                    className="h-100 w-auto"
                    src={project.image}
                    alt="User_Image"
                    style={{ width: "18vmax", height: "18vmax", minWidth: "180px", minHeight: "180px" }}
                />
            </div>

            {/* details */}
            <p className="mt-1">
                {project.summary}
            </p>
        </div>
    )
}

export default Project