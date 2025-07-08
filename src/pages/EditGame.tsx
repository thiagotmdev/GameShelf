import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useGames } from "../context/GamesContext";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  year: z.string().regex(/^[0-9]{4}$/, "Ano inválido"),
  producer: z.string().min(1, "Produtora obrigatória"),
  image: z.string().min(1, "Imagem obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function EditGame() {
  const { id } = useParams();
  const { games, updateGame } = useGames();
  const navigate = useNavigate();

  const gameToEdit = games.find((g) => g.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: gameToEdit?.name || "",
      category: gameToEdit?.category || "",
      year: gameToEdit?.year || "",
      producer: gameToEdit?.producer || "",
      image: gameToEdit?.image || "",
    },
  });

  const [imagePreview, setImagePreview] = useState(gameToEdit?.image || "");

  useEffect(() => {
    if (gameToEdit) {
      setValue("name", gameToEdit.name);
      setValue("category", gameToEdit.category);
      setValue("year", gameToEdit.year);
      setValue("producer", gameToEdit.producer);
      setValue("image", gameToEdit.image);
      setImagePreview(gameToEdit.image);
    }
  }, [gameToEdit, setValue]);

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
    if (!id) return;
    updateGame({ id, ...data });
    navigate("/");
  }

  if (!gameToEdit) {
    return <p className="text-center mt-10">Jogo não encontrado.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Editar Jogo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Nome do jogo</label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-zinc-800 p-2 rounded text-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Categoria</label>
          <input
            type="text"
            {...register("category")}
            className="w-full bg-zinc-800 p-2 rounded text-white"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Ano de publicação</label>
          <input
            type="text"
            {...register("year")}
            className="w-full bg-zinc-800 p-2 rounded text-white"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Produtora</label>
          <input
            type="text"
            {...register("producer")}
            className="w-full bg-zinc-800 p-2 rounded text-white"
          />
          {errors.producer && <p className="text-red-500 text-sm">{errors.producer.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-zinc-300"
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
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}