import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { upvote, downvote } from '../redux/feedSlice';
import { auth, db } from '../firebase';

export const VoteStatus = {
  UPVOTED: 'upvoted',
  DOWNVOTED: 'downvoted',
  NONE: 'none',
};

export function useVote(postId: string) {
  const dispatch = useDispatch();
  const [updatedVoteCount, setUpdatedVoteCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState(VoteStatus.NONE);
  const user = auth.currentUser;
  const displayName = user?.displayName!;

  useEffect(() => {
    const fetchVoteCount = async () => {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUpdatedVoteCount(data.voteCount);
      } else {
        console.log('No such document!');
      }
    };

    const checkVoteStatus = async () => {
      if (user) {
        const docRef = doc(db, 'users', displayName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.upvotedPosts.includes(postId)) {
            setVoteStatus(VoteStatus.UPVOTED);
          } else if (data?.downvotedPosts.includes(postId)) {
            setVoteStatus(VoteStatus.DOWNVOTED);
          }
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchVoteCount();
    checkVoteStatus();
  }, [postId, user]);

  const handleUpvote = async () => {
    if (user) {
      dispatch(upvote({ postId }));
      // Immediately update the UI state
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          setVoteStatus(VoteStatus.NONE);
          setUpdatedVoteCount((prevCount) => prevCount - 1);
          break;
        case VoteStatus.DOWNVOTED:
          setVoteStatus(VoteStatus.UPVOTED);
          setUpdatedVoteCount((prevCount) => prevCount + 2);
          break;
        case VoteStatus.NONE:
          setVoteStatus(VoteStatus.UPVOTED);
          setUpdatedVoteCount((prevCount) => prevCount + 1);
          break;
      }
  
      // Update the database
      const docRef = doc(db, 'users', displayName);
      try {
        switch (voteStatus) {
          case VoteStatus.UPVOTED:
            await updateDoc(docRef, {
              upvotedPosts: arrayRemove(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount - 1,
            });
            break;
          case VoteStatus.DOWNVOTED:
            await updateDoc(docRef, {
              upvotedPosts: arrayUnion(postId),
              downvotedPosts: arrayRemove(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount + 2,
            });
            break;
          case VoteStatus.NONE:
            await updateDoc(docRef, {
              upvotedPosts: arrayUnion(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount + 1,
            });
            break;
        }
      } catch (error) {
        alert('Error updating vote: ' + error);
      }
    } else {
      alert('Sign in to upvote!');
    }
  };
  

  const handleDownvote = async () => {
    if (user) {
      dispatch(downvote({ postId }));
      // Immediately update the UI state
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          setUpdatedVoteCount(prevCount => prevCount - 2);
          setVoteStatus(VoteStatus.DOWNVOTED);
          break;
        case VoteStatus.DOWNVOTED:
          setUpdatedVoteCount(prevCount => prevCount + 1);
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.NONE:
          setUpdatedVoteCount(prevCount => prevCount - 1);
          setVoteStatus(VoteStatus.DOWNVOTED);
          break;
      }

      // Update the database
      const docRef = doc(db, 'users', displayName);
      try {
        switch (voteStatus) {
          case VoteStatus.UPVOTED:
            await updateDoc(docRef, {
              upvotedPosts: arrayRemove(postId),
              downvotedPosts: arrayUnion(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount - 2,
            });
            break;
          case VoteStatus.DOWNVOTED:
            await updateDoc(docRef, {
              downvotedPosts: arrayRemove(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount + 1,
            });
            break;
          case VoteStatus.NONE:
            await updateDoc(docRef, {
              downvotedPosts: arrayUnion(postId),
            });
            await updateDoc(doc(db, 'posts', postId), {
              voteCount: updatedVoteCount - 1,
            });
            break;
        }
    } catch (error) {
      alert('Error updating vote: ' + error);
    }
    } else {
      alert('Sign in to downvote!');
    }
  };

  return {
    updatedVoteCount,
    voteStatus,
    handleUpvote,
    handleDownvote,
  };
}