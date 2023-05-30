import { useState, useRef, useEffect, useReducer } from "react";
import { db } from "../FirebaseInIt";
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore";



function blogsReducer(state, action) {

    switch (action.type) {
        /*AFTER USING REAL TIME UPDATE FROM DATABASE WE DO NOT NEED TO SET BLOGS ANYMORE SO WE DO NOT NEED 'ADD' AND 'REMOVE' CASE */
        // case "ADD":
        //     return [action.blog, ...state];

        // case "REMOVE":
        //     return state.filter((blog, index) => index != action.index);


        case "RENDER":
            return action.blog;

        default:
            return [];

    }

}


//Blogging App using Hooks
export default function Blog() {

    // const [title, setTitle] = useState();
    // const [content, setContent] = useState();


    /*we will pass an object to useState so that we don't have to make two 'useStates' each for title and content */
    const [formData, setFormData] = useState({ title: "", content: "" });

    // const [blogs, setBlogs] = useState([]);
    const [blogs, dispatch] = useReducer(blogsReducer, []);
    const titleRef = useRef(null);



    /*this 'use effect' will set focus on 'title' on mount that is on first render  */
    useEffect(() => {
        titleRef.current.focus();
    }, [])



    /*this 'use effect' is updating document.title */
    useEffect(() => {
        if (blogs.length) {
            document.title = blogs[0].title;
        }
    }, [blogs])


    useEffect(() => {

        /**TO FETCH FOR INTITIAL RENDER ONLY ONCE FROM DATABASE*/
        // async function fetchData() {
        //     const snapshot = await getDocs(collection(db, "blogs"));
        //     console.log(snapshot)
        //     const blog = snapshot.docs.map((doc) => {
        //         return{
        //             id:doc.id,
        //             ...doc.data()
        //         }
        //     })
        //     dispatch({ type: "INITIAL RENDER", blog: blog });
        //     console.log(blog);

        // }

        // fetchData();


        /**TO FETCH ON INITIAL RENDR AND UPDATES WE USE 'onSnapshot' INSTEAD OF 'getDocs FROM DATABASE */
        /*Using 'collection' instead of 'doc' in document reference because we are not providing specific id */
        const unsub = onSnapshot(collection(db, "blogs"), (snapshot) => {

            /*IF we console 'snapshot' we get 'docs' inside it on which we have used map */
            const blog = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            dispatch({ type: "RENDER", blog: blog });
        });


    }, [])



    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e) {
        e.preventDefault();

        /*we can setBlogs in both the ways */
        // setBlogs([formData, ...blogs]);
        // setBlogs([{ title: formData.title, content: formData.content }, ...blogs]);
        // dispatch({ type: "ADD", blog: { title: formData.title, content: formData.content } });

        /** ADDING DATA TO DATABASE*/ 
        await addDoc(collection(db, "blogs"), {
            title: formData.title,
            content: formData.content
        });

        setFormData({ title: "", content: "" });
        titleRef.current.focus();  /*this will set focus on title after first render that is when add button is clicked */



    }



    async function removeBlog(id) {
        // setBlogs(blogs.filter((blog, index) => i !== index));
        // dispatch({ type: "REMOVE", index: i });

        /**DELETING FROM DATABASE USING ID WHCIH WE HAVE OBTAINED FROM 'BLOG' IN 'onSnapshot' METHOD ABOVE */
        await deleteDoc(doc(db, "blogs", id));    /*Here we have to provide specific id that is why we are using 'doc' instead of 'collection' */

    }




    return (
        <>
            {/* Heading of the page */}
            <h1>Write a Blog!</h1>

            {/* Division created to provide styling of section to the form */}
            <div className="section">

                {/* Form for to write the blog */}
                <form onSubmit={handleSubmit}>

                    {/* Row component to create a row for first input field */}
                    <Row label="Title">
                        <input className="input"
                            placeholder="Enter the Title of the Blog here.."
                            value={formData.title}
                            ref={titleRef}
                            required
                            onChange={(e) => setFormData({ title: e.target.value, content: formData.content })}
                        />
                    </Row >

                    {/* Row component to create a row for Text area field */}
                    <Row label="Content">
                        <textarea className="input content"
                            placeholder="Content of the Blog goes here.."
                            value={formData.content}
                            required
                            onChange={(e) => setFormData({ title: formData.title, content: e.target.value })}
                        />
                    </Row >

                    {/* Button to submit the blog */}
                    <button className="btn">ADD</button>
                </form>

            </div>

            <hr />

            {/* Section where submitted blogs will be displayed */}
            <h2> Blogs </h2>


            {blogs.map((blog, i) => (

                <div className="blog" keys={i}>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>

                    <div className="blog-btn">
                        <button onClick={() => removeBlog(blog.id)} className="remove">
                            Delete
                        </button>
                    </div>

                </div>

            ))}

        </>
    )
}



//Row component to introduce a new row section in the form
function Row(props) {
    const { label } = props;
    return (
        <>
            <label>{label}<br /></label>
            {props.children}
            <hr />
        </>
    )
}
