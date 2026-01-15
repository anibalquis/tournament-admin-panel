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
import { Button } from "../ui/button";

export const DeleteTorneoButton = ({ torneo, onDelete }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="cursor-pointer"
          variant="destructive"
          size="sm"
          title="Eliminar Torneo"
        >
          <FiTrash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de eliminar el torneo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Eliminará permanentemente el torneo{" "}
            <strong>{torneo.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#432dd7] cursor-pointer"
            onClick={() => onDelete(torneo)}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
