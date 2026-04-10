import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "./AddPost.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const CATEGORIES = ["Tech","Food","Education","Health","Startup","Social Cause","Art","Music","Film"];
const DEFAULT_IMAGE = "https://via.placeholder.com/600x400?text=FundHub+Campaign";

export default function AddPost() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [goal,setGoal] = useState("");
  const [deadline,setDeadline] = useState("");
  const [category,setCategory] = useState("");
  const [location,setLocation] = useState("");

  const [media,setMedia] = useState([]);
  const [previews,setPreviews] = useState([]);
  const [loading,setLoading] = useState(false);
  const storage = getStorage();

  /* ---------------- LOAD DATA IF EDITING ---------------- */

  useEffect(()=>{

    if(!id) return;

    const fetchDraft = async ()=>{

      setLoading(true);

      try{

        const ref = doc(db,"campaigns",id);
        const snap = await getDoc(ref);

        if(snap.exists()){

          const data = snap.data();

          setTitle(data.title || "");
          setDescription(data.description || "");
          setGoal(data.goal || "");
          setDeadline(data.deadline || "");
          setCategory(data.category || "");
          setLocation(data.location || "");

          if(data.mediaUrls && data.mediaUrls.length>0){
            setPreviews(data.mediaUrls);
          }

        }

      }catch(err){
        console.error("Error loading campaign:",err);
      }

      setLoading(false);

    };

    fetchDraft();

  },[id]);



  /* ---------------- FILE TO BASE64 ---------------- */

  const fileToBase64 = (file)=>{

    return new Promise((resolve,reject)=>{

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = ()=>resolve(reader.result);

      reader.onerror = err=>reject(err);

    });

  };


  /* ---------------- HANDLE MEDIA ---------------- */

  const handleMedia = (e)=>{

    const files = Array.from(e.target.files);

    if(files.length>5){
      alert("Maximum 5 images allowed");
      return;
    }

    setMedia(files);

    const previewUrls = files.map(file=>URL.createObjectURL(file));

    setPreviews(previewUrls);

  };


  /* ---------------- SAVE CAMPAIGN ---------------- */

  const savePost = async(status)=>{

    if(!user) return;

    setLoading(true);

    try{

      let finalUrls = [DEFAULT_IMAGE];

if (media.length > 0) {

  finalUrls = await Promise.all(
    media.map(async (file) => {

      const storageRef = ref(storage, `campaigns/${Date.now()}-${file.name}`);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;

    })
  );

} else if (id && previews.length > 0) {

  finalUrls = previews;

}      const campaignData = {

  title: title || "",
  description: description || "",
  goal: goal ? Number(goal) : 0,
  category: category || "",
  deadline: deadline || null,
  location: location || "",

  mediaUrls: finalUrls,

  status,
  ownerId: user.uid,

  updatedAt: Timestamp.now()

};


      if(id){

        await updateDoc(doc(db,"campaigns",id),campaignData);

      }else{

        await addDoc(collection(db,"campaigns"),{

          ...campaignData,
          raised:0,
          createdAt:Timestamp.now()

        });

      }


      alert(status==="published" ? "Campaign Published 🚀" : "Draft Saved ✨");

      navigate("/profile");

    }catch(err){

      console.error("Save error:",err);
      alert("Failed to save campaign");

    }

    setLoading(false);

  };



  if(loading){
    return <div className="loading">Processing...</div>
  }



  return(

    <div className="add-campaign-wrapper">

      <div className="add-campaign-card">

        <h2>{id ? "Edit Campaign" : "Create Your Campaign"}</h2>

        <form onSubmit={(e)=>{e.preventDefault();savePost("published")}}>

          <input
            placeholder="Campaign Title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Mission..."
            value={description}
            onChange={e=>setDescription(e.target.value)}
            required
          />

          <div className="form-row">

            <input
              type="number"
              placeholder="Goal (₹)"
              value={goal}
              onChange={e=>setGoal(e.target.value)}
              required
            />

            <input
              type="date"
              value={deadline}
              onChange={e=>setDeadline(e.target.value)}
              required
            />

          </div>


          <select
            value={category}
            onChange={e=>setCategory(e.target.value)}
            required
          >

            <option value="">Category</option>

            {CATEGORIES.map(c=>(
              <option key={c} value={c}>{c}</option>
            ))}

          </select>


          <input
            placeholder="Location"
            value={location}
            onChange={e=>setLocation(e.target.value)}
            required
          />


          {/* MEDIA UPLOAD */}

          <div className="media-upload">

            <label className="media-box">

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMedia}
                hidden
              />

              <p>
                {id ? "Change Images" : "Upload Images"} ({media.length || previews.length}/5)
              </p>

            </label>

          </div>



          {/* PREVIEW GRID */}

          <div className="preview-grid">

            {previews.map((url,i)=>(
              <img
                key={i}
                src={url}
                alt={`preview-${i}`}
              />
            ))}

          </div>



          {/* BUTTONS */}

          <div className="action-buttons">

            <button type="submit" className="primary">
              {id ? "Publish Draft" : "Publish"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={()=>savePost("draft")}
            >
              {id ? "Update Draft" : "Save Draft"}
            </button>

            <button
              type="button"
              className="danger"
              onClick={()=>navigate(-1)}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}