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
import { MedicalDegree, Profession, Specialty } from '@/lib/types/supabase';
import MultiSelect from '../multi-select';
import { createClient } from '@/lib/supabase/client';
import { getDoctorGrade } from '@/lib/data-man';

type FormSchema = z.infer<typeof DoctorSchema>;
const professionOptions = [
  'assistant professor',
  'associate professor',
  'professor',
  'consultant',
  'specialist',
  'senior specialist',
];

export default function DoctorCreationForm({
  specialties,
  degrees,
}: {
  specialties: Specialty[];
  degrees: MedicalDegree[];
}) {
  const supabase = createClient();
  const [subSpecialties, setSubSpecialties] = useState<
    string[] | null | undefined
  >([]);
  const [specialty, setSpecialty] = useState<string>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      name: '',
      available: false,
      specialty: '',
      sub_specialties: [],
      hospital: '',
      degree: [],
      experience: 0,
      phone_number: '',
      office_number: '',
      fee: 0,
      grade: 'd',
      profession: 'specialist',
      days_of_week: '',
      start_time: '',
      end_time: '',
      limit: 0,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const grade = await getDoctorGrade(
      data.sub_specialties?.length || 0,
      data.degree,
      data.profession,
      data.experience,
    );
    data.grade = grade;
    const { error } = await supabase.from('doctors').insert([data]).select();
    if (error) {
      console.log('Error inserting data:', error.message);
      return;
    }
    form.reset();
    form.setValue('specialty', '');
    setSelectedOptions([]);
    setSelectedDegree([]);
  };

  useEffect(() => {
    if (specialty) {
      const selected = specialties.find((item) => item.specialty === specialty);
      if (selected) {
        setSubSpecialties(selected?.sub_specialties);
      }
    }
  }, [specialties, specialty]);

  //   if (form.formState.errors) {
  //     console.log(form.formState.errors);
  //   }

  return (
    <Card className="bg-grey-50 w-full overflow-scroll py-4">
      {/* <Button title="bruh" onClick={async () => await getDoctorGrade()}>
        Bruh
      </Button> */}
      <CardContent>
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create Doctor
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
