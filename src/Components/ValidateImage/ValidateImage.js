import React from 'react'

const ValidateImage = ({ setImagePreview, setImage }) => {


    const addImage = (e) => {
        // console.log(e.target.value)
        if (!validate(e)) {
            console.log(e.target.value)
            e.target.value = null;
            setImagePreview(null);
            setImage("");
            return;
        }

        setImage(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
            // set images
            if (reader.readyState === 2) {
                setImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const validate = (e) => {
        let x = true;
        if (
            e.target.files[0].type !== "image/jpeg" &&
            e.target.files[0].type !== "image/png"
        ) {
            console.log("Only jpeg and png are allowed.");
            x = false;
            return x;
        }

        // const reader = new FileReader();
        // reader.readAsDataURL(e.target.files[0]);
        // reader.onload = (e) => {
        //     var image = new Image();
        //     image.src = e.target.result;
        //     image.onload = function () {
        //         if (this.height !== 500 && this.width !== 500) {
        //             console.log("Only 500x500 images are allowed.");
        //         }
        //     };
        // };

        return x;
    }






    return (
        <input
            className="position-absolute top-0 start-0 h-100 w-100 opacity-0"
            role="button"
            type="file"
            accept=".png, .jpg"
            onChange={addImage}
        />
    )
}

export default ValidateImage