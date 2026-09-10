import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Course } from '@/app/interfaces/course';
import { RemoveCourseAction } from '@/server/courses/action';
import toast from 'react-hot-toast';

interface RemoveAlertCourseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSelected: Course;
  onSuccess?: (page:number) => void;
  page:number
}

export default function RemoveAlertCourse({ open, onOpenChange,courseSelected,onSuccess,page }: RemoveAlertCourseProps) {

  async function handelRemove(){
     try {
         const result = await RemoveCourseAction(courseSelected.id); 
         if(result.success){
          toast.success("Curso eliminado exitosamente")
         }
         onSuccess?.(page)
         onOpenChange(false)
     } catch (error) {
        toast.error("Ocurrio un error imesperado")
        console.log(error)
     }
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta asignatura?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el curso "{courseSelected?.name}" junto con sus reseñas. Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handelRemove}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
