import { useFormContext } from "react-hook-form";
import { PackageFormData } from "./package.scheme";
import { usePackageStore } from "@/shared/store/package-store";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { router } from "expo-router";
import { useState, useEffect } from "react";

export function usePackageViewModel(packageId: number | undefined) {
  const isEditMode = Number.isFinite(packageId);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  
  const { packages, addPackage, updatePackage, deletePackage } = usePackageStore();
  const [searchValue, setSearchValue] = useState("");

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const packageContent = packages.find((p) => p.id === packageId);

  const {
    control,
    handleSubmit,
    reset,
  } = useFormContext<PackageFormData>();

  // Prepopulate form in edit mode
  useEffect(() => {
    if (isEditMode && packageContent) {
      reset({
        name: packageContent.name,
        price: packageContent.price,
        duration: packageContent.duration,
        description: packageContent.description,
        servicesIncluded: packageContent.servicesIncluded || "",
        imgUrl: packageContent.imgUrl || "",
      });
    } else {
      reset({
        name: "",
        price: "",
        duration: "",
        description: "",
        servicesIncluded: "",
        imgUrl: "",
      });
    }
  }, [packageId, packageContent, isEditMode]);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      if (isEditMode && packageId) {
        updatePackage(packageId, {
          name: formData.name,
          price: formData.price,
          duration: formData.duration,
          description: formData.description || "",
          servicesIncluded: formData.servicesIncluded || "",
          imgUrl: formData.imgUrl || ""
        });
        notify({message: "Pacote atualizado com sucesso!", type: "SUCCESS"});
      } else {
        addPackage({
          name: formData.name,
          price: formData.price,
          duration: formData.duration,
          description: formData.description || "",
          servicesIncluded: formData.servicesIncluded || "",
          imgUrl: formData.imgUrl || ""
        });
        notify( {message: "Pacote criado com sucesso!",  type: "SUCCESS" }

        );
      }
      router.back();
    } catch (err) {
      notify({message: "Erro ao salvar pacote", type: "ERROR"});
    } finally {
      setIsLoading(false);
    }
  });

  const onPackageDelete = async () => {
    if (isEditMode && packageId) {
      deletePackage(packageId);
      notify({message: "Pacote excluído com sucesso!", type: "SUCCESS"});
      router.back();
    }
  };

  return {
    control,
    onSubmit,
    isEditMode,
    packageContent,
    packageId,
    isLoading,
    onPackageDelete,
    packages: filteredPackages,
    searchValue,
    setSearchValue,
  };
}
