"use client";
import toast from "react-hot-toast";

import { removeCommentAction } from "@/server/comments/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type RemoveAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: string;
  commentId: string;
  onSuccess?: () => void; 
};

export function RemoveAlert({
  onOpenChange,
  params,
  commentId,
  open,
  onSuccess,
}: RemoveAlertProps) {
  async function removeComment() {
    try {
      const result = await removeCommentAction(commentId, params);

      if (!result?.success) {
        toast.error(result?.error || "Error al eliminar el comentario");
        return;
      }

      toast.success("Comentario eliminado exitosamente");
      onOpenChange(false);
      onSuccess?.(); 
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      toast.error("Ocurrió un error inesperado al eliminar");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que quieres eliminar este comentario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente tu
            comentario de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeComment}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
