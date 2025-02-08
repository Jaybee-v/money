"use client";
import {
  createCategoryExpense,
  getCategoriesExpense,
} from "@/actions/expense.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCategoryExpenseDto } from "@/lib/dtos/CreateCategoryExpenseDto";
import { CategoryExpense } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SelectExpenseCategoryProps {
  userId: string;
  selected: string | null;
  onChange: (e: string) => void;
}

export const SelectExpenseCategory = ({
  userId,
  selected,
  onChange,
}: SelectExpenseCategoryProps) => {
  const [categories, setCategories] = useState<CategoryExpense[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategoriesExpense(userId);
      setCategories(response.data);
    };
    fetchCategories();
  }, [userId]);

  const onSubmit = async () => {
    console.log(value);
    const createCategoryExpenseDto: CreateCategoryExpenseDto = {
      name: value,
      userId: userId,
    };
    const response = await createCategoryExpense(createCategoryExpenseDto);
    console.log(response);
    if (response.success) {
      const newCategory = response.data;
      setCategories([...categories, newCategory]);
      setValue("");
      setOpen(false);
    }
  };

  return (
    <section className="flex items-center gap-2 justify-between">
      <Select value={selected ? selected : undefined} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={"category_" + category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="text-sm bg-secondary px-2 py-1 rounded-md font-semibold hover:bg-secondary/80">
          Créer une nouvelle catégorie
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-600">
              Ajouter une catégorie
            </DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle catégorie pour organiser vos dépenses.
            </DialogDescription>
          </DialogHeader>
          <section className="space-y-2">
            <Input
              type="text"
              placeholder="Nom de la catégorie"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <section className="flex justify-end">
              <Button type="button" onClick={onSubmit}>
                Créer
              </Button>
            </section>
          </section>
        </DialogContent>
      </Dialog>
    </section>
  );
};
