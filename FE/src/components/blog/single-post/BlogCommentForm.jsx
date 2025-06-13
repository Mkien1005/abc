"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BlogComment } from "@/data/Comments";

const BlogCommentForm = ({ metaData }) => {
  const [blogCommentForm, setBlogCommentForm] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const CommentDataHandler = (data) => {
    data.postId = metaData.id;
    setBlogCommentForm(data);
  };

  const getComment = BlogComment.filter((data) => data.postId === metaData.id);

  return (
    <>
      <div className="axil-comment-area">
        <h4 className="title">{getComment.length} bình luận</h4>
        <ul className="comment-list">
          {getComment?.map((comment) => (
            <li className="comment" key={comment.id}>
              <div className="comment-body">
                <div className="single-comment">
                  <div className="comment-img">
                    <Image
                      src={comment.author_img}
                      width={60}
                      height={60}
                      alt={comment.author_name}
                    />
                  </div>
                  <div className="comment-inner">
                    <h6 className="commenter">{comment.author_name}</h6>
                    <div className="comment-meta">
                      <div className="time-spent">
                        {comment.date} lúc {comment.time}
                      </div>
                      <div className="reply-edit">
                        <div className="reply">
                          <button className="comment-reply-link">Trả lời</button>
                        </div>
                      </div>
                    </div>
                    <div className="comment-text">
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="children">
                {comment.reply?.map((reply) => (
                  <li className="comment" key={reply.replyId}>
                    <div className="comment-body">
                      <div className="single-comment">
                        <div className="comment-img">
                          <Image
                            src={reply.author_img}
                            width={60}
                            height={60}
                            alt={reply.author_name}
                          />
                        </div>
                        <div className="comment-inner">
                          <h6 className="commenter">{reply.author_name}</h6>
                          <div className="comment-meta">
                            <div className="time-spent">
                              {reply.date} lúc {reply.time}
                            </div>
                            <div className="reply-edit">
                              <div className="reply">
                                <button className="comment-reply-link">
                                  Trả lời
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="comment-text">
                            <p>{reply.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="comment-respond">
        <h4 className="title">Để lại bình luận</h4>
        <form onSubmit={handleSubmit(CommentDataHandler)}>
          <p className="comment-notes">
            <span id="email-notes">
              Địa chỉ email của bạn sẽ không được công khai.
            </span>
          </p>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Để lại bình luận</label>
                <textarea
                  {...register("message", { required: true })}
                  placeholder="Bình luận của bạn"
                />
                {errors.message && (
                  <p className="error">Vui lòng nhập bình luận.</p>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>
                  Tên <span>*</span>
                </label>
                <input {...register("name", { required: true })} type="text" />
                {errors.name && <p className="error">Vui lòng nhập tên.</p>}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>
                  Email <span>*</span>{" "}
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                />
                {errors.email && <p className="error">Vui lòng nhập email.</p>}
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-submit">
                <button
                  name="submit"
                  type="submit"
                  id="submit"
                  className="axil-btn btn-bg-primary w-auto"
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogCommentForm;
