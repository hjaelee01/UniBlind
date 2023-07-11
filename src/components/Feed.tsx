import { useSelector } from "react-redux"
import { Post } from "./Post"
import { Grid, GridItem } from "@chakra-ui/react"
import { FeedType } from "../types/FeedType"
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function Feed() {
    const [feed, setFeed] = useState<FeedType>();
  
    // Fetching posts data from Firestore
    useEffect(() => {
      const fetchData = async () => {
        try {
          const postsCollection = collection(db, "posts");
          const querySnapshot = await getDocs(postsCollection);
          const postData = querySnapshot.docs.map((doc) => doc.data());
          setFeed(postData as FeedType);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
    
      fetchData();
    }, []);

    return (
        <div>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {feed?.map((x) => (
                <GridItem key={x.postId}>
                  <Post
                    originalPoster={x.originalPoster}
                    postId={x.postId}
                    title={x.title}
                    text={x.text.length > 100 ? x.text.substring(0, 100) + "..." : x.text}
                    voteCount={x.voteCount}
                  />
                </GridItem>
              ))}
            </Grid>
        </div>
    )
}