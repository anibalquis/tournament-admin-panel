import { FiTrash2 } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export const DeleteClubButton = ({ club, onDelete }) => {
  console.log(club)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="text-red-600 hover:text-red-800"
          title="Eliminar"
        >
          <FiTrash2 />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas completamente seguro</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Eliminará permanentemente {club.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(club)}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
