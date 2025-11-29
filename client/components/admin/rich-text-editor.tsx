"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Highlight from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import { FontSize } from "@/lib/tiptap-font-size"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Highlighter,
  Palette,
  Type
} from "lucide-react"
import { useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [selectedFontSize, setSelectedFontSize] = useState("16")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      HorizontalRule,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return <div className="h-64 border rounded-md flex items-center justify-center">Carregando editor...</div>
  }

  const addImage = () => {
    const url = window.prompt("URL da imagem:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL do link:", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const insertDivider = (thickness: 'thin' | 'medium' | 'thick') => {
    const thicknessMap = {
      thin: '1px',
      medium: '3px',
      thick: '6px'
    }

    // Inserir um HR customizado
    editor.chain().focus().setHorizontalRule().run()

    // Aplicar estilo inline através de um wrapper
    const hr = editor.view.dom.querySelector('hr:last-of-type')
    if (hr) {
      hr.style.borderWidth = thicknessMap[thickness]
      hr.style.borderColor = '#000000'
      hr.style.borderStyle = 'solid'
      hr.style.margin = '1rem 0'
    }
  }

  const setTextColor = (color: string) => {
    setSelectedColor(color)
    editor.chain().focus().setColor(color).run()
  }

  const setFontSize = (size: string) => {
    setSelectedFontSize(size)
    editor.chain().focus().setFontSize(`${size}px`).run()
  }

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run()
  }

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden">
      {/* Toolbar Principal */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {/* Formatação de Texto */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-200" : ""}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-gray-200" : ""}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-gray-200" : ""}
            title="Sublinhado"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Títulos */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Alinhamento */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? "bg-gray-200" : ""}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? "bg-gray-200" : ""}
            title="Centralizar"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? "bg-gray-200" : ""}
            title="Alinhar à direita"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Listas */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Links e Imagens */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive("link") ? "bg-gray-200" : ""}
            title="Inserir link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Inserir imagem"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Highlight */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fbbf24' }).run()}
            className={editor.isActive("highlight") ? "bg-gray-200" : ""}
            title="Destacar texto"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar Secundária - Cores, Fontes, Linhas */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 items-center">
        {/* Cor do Texto */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gray-600" />
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-10 h-8 border rounded cursor-pointer"
            title="Cor do texto"
          />
          <span className="text-xs text-gray-600">Cor</span>
        </div>

        {/* Tamanho da Fonte */}
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-gray-600" />
          <Select value={selectedFontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder="Tam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
              <SelectItem value="28">28px</SelectItem>
              <SelectItem value="32">32px</SelectItem>
              <SelectItem value="36">36px</SelectItem>
              <SelectItem value="48">48px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fonte */}
        <div className="flex items-center gap-2">
          <Select onValueChange={setFontFamily}>
            <SelectTrigger className="w-36 h-8">
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Volkhov">Volkhov</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divisores */}
        <div className="flex items-center gap-2 pl-2 border-l">
          <Minus className="h-4 w-4 text-gray-600" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertDivider('thin')}
            className="h-8"
            title="Linha fina"
          >
            <div className="w-6 h-[1px] bg-gray-600"></div>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertDivider('medium')}
            className="h-8"
            title="Linha média"
          >
            <div className="w-6 h-[3px] bg-gray-600"></div>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertDivider('thick')}
            className="h-8"
            title="Linha grossa"
          >
            <div className="w-6 h-[6px] bg-gray-600"></div>
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-[400px] prose max-w-none" />
    </div>
  )
}
