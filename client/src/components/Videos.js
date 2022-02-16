import { useEffect, useState } from "react";

const Videos = (props) => {
    const [name, setName] = useState();
    const [video, setVideo] = useState();
    const [videos, setVideos] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState();
    const _handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('name', name);
        formData.append('video', video);
        const response = await fetch('/videos?secret_token=' + localStorage.getItem('blackbox_token'), {
            method: 'POST',
            body: formData
        }).catch(err => {
        });
        if (response.ok) {
            const data = await response.json();
            setIsFormOpen(!isFormOpen);
            setVideos([...videos, data.video])
        }
    }

    const _handleEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        const response = await fetch(`/videos/${activeVideo}?secret_token=${localStorage.getItem('blackbox_token')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        }).catch(err => {
        });
        if (response.ok) {
            const data = await response.json();
            setIsEditFormOpen(!isEditFormOpen);
            setVideos(videos.map(el => {
                if (el._id == activeVideo)
                    el.name = name;
                return el;
            }));
        }
    }
    const _toggleUploadForm = () => {
        setIsFormOpen(!isFormOpen);
    };
    const _handleNameChange = (e) => {
        setName(e.target.value);
    }
    const _handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    }
    const _handleDelete = async (id) => {
        const response = await fetch(`/videos/${id}?secret_token=${localStorage.getItem('blackbox_token').trim()}`, {
            method: 'DELETE',
        });
        setVideos(videos.filter(el => el._id != id))
    }
    const _toggleEditForm = (el) => {
        setIsEditFormOpen(true);
        setActiveVideo(el._id);
        setName(el.name)
    }
    useEffect(async () => {
        const response = await fetch('/videos?secret_token=' + localStorage.getItem('blackbox_token'), {
            method: 'GET',
            // body: JSON.stringify(formData)
        }).catch(err => {
        });
        if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.videos)
                setVideos(data.user.videos);
        }
    }, []);

    return <div>
        <div className="videos-container">
            {videos.map(el =>
                <div key={Math.random()} >
                    <div>
                        <video controls>
                            <source src={el.url} />
                        </video>
                    </div>
                    <div> {el.name}</div>
                    <div className="delete" onClick={() => _handleDelete(el._id)}>Delete</div>
                    <div className="edit" onClick={() => _toggleEditForm(el)}>Rename</div>
                </div>
            )}
        </div>
        <button onClick={_toggleUploadForm} className="upload">Upload File</button>
        {isFormOpen ?
            <form className="upload-form" onSubmit={_handleSubmit}>
                <div>
                    <div>
                        <input value={name} name="name" placeholder="Name" onChange={_handleNameChange} required />
                    </div>
                    <div>
                        <input type="file" name="video" onChange={_handleVideoChange} required />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                    <div>
                        <button onClick={_toggleUploadForm}>Close</button>
                    </div>
                </div>
            </form> : ""}
        {isEditFormOpen ?
            <form className="upload-form" onSubmit={_handleEdit}>
                <div>
                    <div>
                        <input value={name} name="name" placeholder="Name" onChange={_handleNameChange} required />
                    </div>
                    <div>
                        <button type="submit">Rename</button>
                    </div>
                    <div>
                        <button onClick={_toggleEditForm}>Close</button>
                    </div>
                </div>
            </form> : ""}
    </div>
}
export default Videos;