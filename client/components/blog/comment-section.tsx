"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    name: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await api.post("/comments", {
        post_id: postId,
        content: newComment,
      })

      setComments([response.data.comment, ...comments])
      setNewComment("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao enviar comentário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await api.post("/comments", {
        post_id: postId,
        content: replyContent,
        parent_id: parentId,
      })

      // Update comments state with the new reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data.comment],
          }
        }
        return comment
      })

      setComments(updatedComments)
      setReplyContent("")
      setReplyTo(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao enviar resposta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <h3 className="font-serif text-2xl font-bold text-navy-950 mb-6">Comentários</h3>

      {/* New Comment Form */}
      <div className="mb-8">
        <form onSubmit={handleSubmitComment}>
          <Textarea
            placeholder={isAuthenticated ? "Deixe seu comentário..." : "Faça login para comentar"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated || isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            rows={4}
          />

          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

          <div className="mt-3 flex justify-end">
            <Button
              type="submit"
              disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
              className="bg-navy-950 text-white hover:bg-navy-900"
            >
              {isSubmitting ? "Enviando..." : "Enviar comentário"}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-navy-950">{comment.author.name}</h4>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>

                  {isAuthenticated && (
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="mt-2 text-sm text-gold hover:underline"
                    >
                      {replyTo === comment.id ? "Cancelar resposta" : "Responder"}
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="mt-4 ml-6">
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)}>
                    <Textarea
                      placeholder="Escreva sua resposta..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                      rows={3}
                    />

                    <div className="mt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !replyContent.trim()}
                        className="bg-navy-950 text-white hover:bg-navy-900 text-sm py-1 px-3"
                      >
                        {isSubmitting ? "Enviando..." : "Responder"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-navy-950">{reply.author.name}</h4>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  )
}
