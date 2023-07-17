import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { upvote, downvote } from '../redux/feedSlice';
import { auth, db } from '../firebase';

export function useVote(postId: string, voteCount: number) {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const displayName = user?.displayName!;
  const [updatedVoteCount, setUpdatedVoteCount] = useState<number>(voteCount);
  const VoteStatus = {
    UPVOTED: 'upvoted',
    DOWNVOTED: 'downvoted',
    NONE: 'none'
  };

  const [voteStatus, setVoteStatus] = useState<string>(VoteStatus.NONE);
  useEffect(() => {
    if (user) {
      const checkVoteStatus = async () => {
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
      };
      checkVoteStatus();
    }
  }, [user, postId]);

  const handleUpvote = async () => {
    if (user) {
      const docRef = doc(db, 'users', displayName);
      dispatch(upvote({ postId: postId }));
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          await updateDoc(docRef, {
            upvotedPosts: arrayRemove(postId)
          });
          setUpdatedVoteCount(updatedVoteCount - 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 1
          });
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.DOWNVOTED:
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId),
            downvotedPosts: arrayRemove(postId)
          });
          setUpdatedVoteCount(updatedVoteCount + 2);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 2
          });
          setVoteStatus(VoteStatus.UPVOTED);
          break;
        case VoteStatus.NONE:
          await updateDoc(docRef, {
            upvotedPosts: arrayUnion(postId)
          });
          setUpdatedVoteCount(updatedVoteCount + 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 1
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
      dispatch(downvote({ postId: postId }));
      switch (voteStatus) {
        case VoteStatus.UPVOTED:
          await updateDoc(docRef, {
            upvotedPosts: arrayRemove(postId),
            downvotedPosts: arrayUnion(postId)
          });
          setUpdatedVoteCount(updatedVoteCount - 2);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 2
          });
          setVoteStatus(VoteStatus.DOWNVOTED);
          break;
        case VoteStatus.DOWNVOTED:
          await updateDoc(docRef, {
            downvotedPosts: arrayRemove(postId)
          });
          setUpdatedVoteCount(updatedVoteCount + 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount + 1
          });
          setVoteStatus(VoteStatus.NONE);
          break;
        case VoteStatus.NONE:
          await updateDoc(docRef, {
            downvotedPosts: arrayUnion(postId)
          });
          setUpdatedVoteCount(updatedVoteCount - 1);
          await updateDoc(doc(db, 'posts', postId), {
            voteCount: updatedVoteCount - 1
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
    handleUpvote,
    handleDownvote,
    voteStatus
  };
}