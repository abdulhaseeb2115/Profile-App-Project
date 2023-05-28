import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
// pdf imports
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

const ViewResume = ({ resume, setViewResume }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    return (
        <div
            className="AddProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 pb-4 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ height: "90vh", zIndex: "20" }}
        >
            <div className="pe-4" style={{ overflow: "auto" }}>
                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center mb-3">
                    <h2 className="fw-bold m-0">Add Project</h2>
                    <AiFillCloseCircle size="30px" onClick={() => setViewResume(false)} />
                </div>

                {/* pdf */}
                <div className="col-12 d-flex justify-content-center">
                    <Document
                        file={{
                            url: resume,
                        }}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {[...Array(numPages)].map((e, i) => (
                            <>
                                <Page pageNumber={pageNumber} width={450} key={i} />
                                <p>
                                    Page {i + 1} of {numPages}
                                </p>
                            </>
                        ))}
                    </Document>

                </div>
            </div>
        </div>
    );
};

export default ViewResume;
