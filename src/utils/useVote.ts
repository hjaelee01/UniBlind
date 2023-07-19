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
      const docRef = doc(db, 'users', displayName);
      dispatch(upvote({ postId }));
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          // Update user's upvotedPosts array in database
          await updateDoc(docRef, {
            upvotedPosts: arrayRemove(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount - 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 1,
          });
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.DOWNVOTED:
          // Update user's upvotedPosts & downvotedPosts array in database
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId),
            downvotedPosts: arrayRemove(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount + 2);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 2,
          });
          setVoteStatus(VoteStatus.UPVOTED);
          break;
        case VoteStatus.NONE:
          // Update user's upvotedPosts array in database
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount + 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 1,
          });
          setVoteStatus(VoteStatus.UPVOTED);
          break;
      }
    } else {
      alert('Sign in to upvote!');
    }
  };

  const handleDownvote = async () => {
    if (user) {
      const docRef = doc(db, 'users', displayName);
      dispatch(downvote({ postId }));
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          // Update user's upvotedPosts & downvotedPosts array in database
          await updateDoc(docRef, {
            upvotedPosts: arrayRemove(postId),
            downvotedPosts: arrayUnion(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount - 2);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 2,
          });
          setVoteStatus(VoteStatus.DOWNVOTED);
          break;
        case VoteStatus.DOWNVOTED:
          // Update user's downvotedPosts array in database
          await updateDoc(docRef, {
            downvotedPosts: arrayRemove(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount + 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 1,
          });
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.NONE:
          // Update user's downvotedPosts array in database
          await updateDoc(docRef, {
            downvotedPosts: arrayUnion(postId),
          });
          // Update votecount in both UI and database
          setUpdatedVoteCount(prevCount => prevCount - 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 1,
          });
          setVoteStatus(VoteStatus.DOWNVOTED);
          break;
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