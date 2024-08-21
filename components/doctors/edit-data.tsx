import React, { use, useEffect, useState } from 'react';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '../ui/card';
import { DoctorSchema } from '@/lib/schema/form';
import {
  Doctor,
  MedicalDegree,
  Profession,
  Specialty,
} from '@/lib/types/supabase';
import MultiSelect from '../multi-select';
import { createClient } from '@/lib/supabase/client';
import { getDoctorGrade } from '@/lib/data-man';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Pencil } from 'lucide-react';

type FormSchema = z.infer<typeof DoctorSchema>;
const professionOptions = [
  'assistant professor',
  'associate professor',
  'professor',
  'consultant',
  'specialist',
  'senior specialist',
];

export function DoctorEditForm({
  data,
  specialties,
  degrees,
  handleToast,
}: {
  data: Doctor;
  specialties: Specialty[];
  degrees: MedicalDegree[];
  handleToast: (message: string) => void;
}) {
  const supabase = createClient();
  const [subSpecialties, setSubSpecialties] = useState<
    string[] | null | undefined
  >([]);
  const [specialty, setSpecialty] = useState<string>(data.specialty);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    JSON.parse(data?.sub_specialties || '') || [],
  );
  const [selectedDegree, setSelectedDegree] = useState<string[]>(
    JSON.parse(data.degree) || [],
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      name: data.name,
      available: data.available,
      specialty: data.specialty,
      sub_specialties: JSON.parse(data?.sub_specialties || '') || [],
      hospital: data.hospital,
      degree: JSON.parse(data?.degree || '') || [],
      experience: data.experience,
      phone_number: data.phone_number,
      office_number: data.office_number,
      fee: data.fee,
      profession: data.profession,
      days_of_week: data.days_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      limit: data.limit,
    },
  });

  const onSubmit = async (formData: FormSchema) => {
    const grade = await getDoctorGrade(
      formData.sub_specialties?.length || 0,
      formData.degree,
      formData.profession,
      formData.experience,
    );
    formData.grade = grade;
    const { error } = await supabase
      .from('doctors')
      .update(formData)
      .eq('id', data.id);
    if (error) {
      console.log('Error updateing data:', error.message);
      return;
    }
    handleToast('Doctor updated successfully');
  };

  useEffect(() => {
    if (specialty) {
      const selected = specialties.find((item) => item.specialty === specialty);
      if (selected) {
        setSubSpecialties(selected?.sub_specialties);
      }
    }
  }, [specialties, specialty]);

  return (
    <Sheet>
      <SheetTrigger>
        <Pencil
          size={18}
          className="h-6 w-6 rounded-lg border border-gray-300 p-1"
        />
      </SheetTrigger>
      <SheetContent className="in-w-[500px] overflow-scroll">
        <SheetTitle>Edit Doctor</SheetTitle>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doctor's name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Is the doctor currently available for appointments?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        setSelectedOptions([]);
                        setSpecialty(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties.map((item, index) => (
                          <SelectItem key={index} value={item.specialty}>
                            {item.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {specialty && subSpecialties && (
                <MultiSelect
                  label={'Sub Specialties'}
                  options={subSpecialties}
                  selectedOptions={selectedOptions}
                  onChange={(items: string[]) => {
                    setSelectedOptions(items);
                    form.setValue('sub_specialties', items);
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {degrees && (
                <MultiSelect
                  label={'Degree'}
                  options={degrees.map((degree) => degree.degree)}
                  selectedOptions={selectedDegree}
                  onChange={(items: string[]) => {
                    setSelectedDegree(items);
                    form.setValue('degree', items);
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="office_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Office number"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        setSpecialty(e);
                      }}
                      defaultValue={field.value as Profession}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select profession"
                            className=" capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professionOptions.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className=" capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="days_of_week"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days of Week</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Mon,Wed,Fri"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="start_time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="end_time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="limit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value?.toString() || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? Number(value) : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mb-5"
                disabled={form.formState.isSubmitting}
              >
                Edit Doctor
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
