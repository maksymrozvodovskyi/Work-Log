import { useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import BaseModal from "@/components/BaseModal";
import Avatar from "@/components/Avatar";
import RightArrowIcon from "@/components/svg/RightArrowIcon";
import Loader from "@/components/Loader";

import css from "./index.module.css";

import { VACATIONS_QUERY_KEY } from "@/features/vacations/queryKeys";
import {
  getVacationComments,
  createVacationComment,
} from "@/api/vacationComments";

type Props = {
  userId: string;
  userName: string;
  onClose: () => void;
};

const TAKE = 5;

export default function VacationCommentsModal({
  userId,
  userName,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const commentsQuery = useInfiniteQuery({
    queryKey: [VACATIONS_QUERY_KEY.vacationComments, userId],
    queryFn: ({ pageParam }) =>
      getVacationComments({ userId, take: TAKE, skip: pageParam ?? 0 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextSkip : undefined,
  });

  const createMutation = useMutation({
    mutationFn: () => createVacationComment(userId, { content: text.trim() }),
    onSuccess: async () => {
      setText("");
      await queryClient.invalidateQueries({
        queryKey: [VACATIONS_QUERY_KEY.vacationComments, userId],
      });
    },
  });

  const comments = useMemo(() => {
    const pages = commentsQuery.data?.pages ?? [];
    return pages.flatMap((p) => p.items);
  }, [commentsQuery.data?.pages]);

  const isInitialLoading = commentsQuery.isLoading;
  const isError = commentsQuery.isError;

  const isLoadingMore = commentsQuery.isFetchingNextPage;
  const canLoadMore = commentsQuery.hasNextPage;

  const isSaveDisabled = !text.trim() || createMutation.isPending;

  const isEmpty = !isInitialLoading && !isError && comments.length === 0;

  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      headerContent={
        <div className={css.header}>
          <div className={css.headerTop}>
            <div className={css.title}>Comments for</div>

            <button
              className={css.arrowBtn}
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <RightArrowIcon fill="#F5F6FA" />
            </button>
          </div>

          <div className={css.userRow}>
            <Avatar name={userName} size="small" />

            <div className={css.userMeta}>
              <span>{userName}</span>
            </div>
          </div>
        </div>
      }
      showOverlay={false}
      modalStyle={{
        width: "336px",
        border: "1px solid #222327",
        borderRadius: "8px 0 0 8px",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.4)",
        background: "#383d44",
        zIndex: 1100,
      }}
    >
      <div className={css.body}>
        <textarea
          className={css.textarea}
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className={css.actions}>
          <button
            type="button"
            className={css.clearBtn}
            onClick={() => setText("")}
            disabled={!text}
          >
            Clear
          </button>

          <button
            type="button"
            className={css.saveBtn}
            onClick={() => createMutation.mutate()}
            disabled={isSaveDisabled}
          >
            {createMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>

        <div className={css.lastTitle}>Last comments</div>

        {isError && <div className={css.muted}>Error loading comments</div>}

        {!isError && (
          <>
            {isInitialLoading ? (
              <div className={css.initialLoader}>
                <Loader inline />
              </div>
            ) : (
              <div className={css.list}>
                {isEmpty ? (
                  <div className={css.empty}>No comments yet</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className={css.item}>
                      <div className={css.meta}>
                        <Avatar name={comment.author.name} size="small" />
                        <span className={css.author}>
                          {comment.author.name}
                        </span>
                      </div>

                      <div className={css.content}>{comment.content}</div>

                      <div className={css.date}>
                        {new Date(comment.createdAt).toLocaleString("uk-UA")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!isInitialLoading && !isLoadingMore && canLoadMore && !isEmpty && (
              <button
                type="button"
                className={css.loadMoreButton}
                onClick={() => commentsQuery.fetchNextPage()}
              >
                Load more
              </button>
            )}

            {!isInitialLoading && isLoadingMore && (
              <div className={css.loadMoreLoader}>
                <Loader inline />
              </div>
            )}
          </>
        )}
      </div>
    </BaseModal>
  );
}
