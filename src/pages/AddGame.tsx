import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useGames } from "../context/GamesContext";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  year: z.string().regex(/^[0-9]{4}$/, "Ano inválido"),
  producer: z.string().min(1, "Produtora obrigatória"),
  image: z.string().min(1, "Imagem obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function AddGame() {
  const { addGame } = useGames();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [imagePreview, setImagePreview] = useState("");

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setValue("image", base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  function onSubmit(data: FormData) {
    addGame(data);
    navigate("/");
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Adicionar Jogo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-zinc-300 dark:text-zinc-300">Nome do jogo</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-zinc-300 dark:text-zinc-300">Categoria</label>
          <input
            type="text"
            {...register("category")}
            className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-zinc-300 dark:text-zinc-300">Ano de publicação</label>
          <input
            type="text"
            {...register("year")}
            className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-zinc-300 dark:text-zinc-300">Produtora</label>
          <input
            type="text"
            {...register("producer")}
            className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
          />
          {errors.producer && <p className="text-red-500 text-sm">{errors.producer.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-zinc-300 dark:text-zinc-300">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg mt-2"
          />
        )}

        <button
          type="submit"
          className="mt-4 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-xl font-semibold"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
