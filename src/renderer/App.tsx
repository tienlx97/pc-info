import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Separator } from '@/components/ui/separator';

import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckIcon, ChevronDownIcon, Loader2, Send } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const { ipcRenderer } = window.electron;

const pcInfoFormSchema = z.object({
  firstName: z.string({
    required_error: 'bắt buộc',
  }),
  lastName: z.string({
    required_error: 'bắt buộc',
  }),

  company: z.enum(['ct', 'dn'], {
    invalid_type_error: 'Chọn công ty',
    required_error: 'Xin chọn công ty',
  }),

  department: z.string({
    required_error: 'bắt buộc',
  }),

  software: z
    .string({
      required_error: 'bắt buộc',
    })
    .min(1, 'bắt buộc'),
});

type PcInfoFormValues = z.infer<typeof pcInfoFormSchema>;

type CompanyKeys = 'ct' | 'dn';

const companyList: Record<CompanyKeys, string> = {
  ct: 'Chí Thành',
  dn: 'Đại Nghĩa',
};

const departmentList: Record<CompanyKeys, string[]> = {
  ct: [
    'Phòng thiết kế',
    'Phòng quản lý dự án',
    'Phòng kế toán',
    'Phòng vật tư',
    'Phòng dự toán đấu thầu',
    'Phòng nhân sự',
  ],
  dn: [
    'Phòng thiết kế',
    'Phòng quản lý dự án',
    'Phòng kế toán',
    'Phòng vật tư',
    'Phòng dự toán đấu thầu',
    'Phòng kỹ thuật',
  ],
};

// This can come from your database or API.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultValues: Partial<PcInfoFormValues> = {
  company: 'ct',
};

function AppRoute() {
  // const [deviceID, setDeviceID] = useState<string | undefined>(undefined);
  const hardwareIdRef = useRef();
  const [systemInfo, setSystemInfo] = useState<any | undefined>(undefined);

  const { toast } = useToast();

  const form = useForm<PcInfoFormValues>({
    resolver: zodResolver(pcInfoFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      company,
      department,
      software,
    }: PcInfoFormValues) => {
      const response = await fetch(
        `https://sheet.best/api/sheets/564826dc-7e23-402a-acc0-594823dc9e7e/Hardware/${hardwareIdRef.current}`,
        {
          method: 'PATCH',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Hardware: hardwareIdRef.current,
            Họ: firstName,
            Tên: lastName,
            // @ts-ignore
            'Công ty': companyList[`${company}`],
            'Phòng ban': department,
            'Phần mềm chuyên ngành': software,
            PC: systemInfo,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to insert new todo');
      }

      // eslint-disable-next-line no-return-await
      const result = await response.json();

      if (result.length !== 0) {
        return result;
      }

      const res2 = await fetch(
        `https://sheet.best/api/sheets/564826dc-7e23-402a-acc0-594823dc9e7e`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Hardware: hardwareIdRef.current,
            Họ: firstName,
            Tên: lastName,
            // @ts-ignore
            'Công ty': companyList[`${company}`],
            'Phòng ban': department,
            'Phần mềm chuyên ngành': software,
            PC: systemInfo,
          }),
        },
      );

      if (!res2.ok) {
        throw new Error('Failed to insert new todo');
      }

      // eslint-disable-next-line no-return-await
      return await res2.json();
    },

    onSuccess() {
      toast({
        variant: 'success',
        title: 'Cập nhật thành công',
        description: ' Xin cảm ơn!',
      });

      setTimeout(() => {
        ipcRenderer.sendMessage('ipc-close');
      }, 2000);
    },
  });

  const watchCompany = form.watch('company');

  const departmentListFilterByCompanyKey = useMemo(() => {
    form.resetField('department', {
      defaultValue: undefined,
    });

    return departmentList[`${watchCompany}`];
  }, [form, watchCompany]);

  const onSubmit = (data: PcInfoFormValues) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    // ipcRenderer.sendMessage('ipc-get-device-id');
    // ipcRenderer.once('ipc-get-device-id', (...args: any) => {
    //   setDeviceID(args[0]);
    // });

    ipcRenderer.sendMessage('ipc-system-information');

    ipcRenderer.once('ipc-system-information', (...args: any) => {
      hardwareIdRef.current = args[0].uuid.hardware;
      setSystemInfo(args[0]);
    });
  }, []);

  return (
    <div className="m-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Thông tin máy tính</h3>
          <p className="text-sm text-muted-foreground">
            Phục vụ cho mục đích quản lý
          </p>
        </div>
        <Separator />
      </div>
      <div className="mt-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Công ty</FormLabel>
                <div className="w-full relative">
                  <FormControl>
                    <select
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'w-full appearance-none bg-transparent font-normal',
                      )}
                      {...field}
                    >
                      {Object.entries(companyList).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <div className="flex flex-row items-center">
                  {form.formState.errors.department ? (
                    <FormLabel>
                      Phòng ban {form.formState.errors.department.message}
                    </FormLabel>
                  ) : (
                    <FormLabel disableError>Phòng ban</FormLabel>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? departmentListFilterByCompanyKey.find(
                              (department) => department === field.value,
                            )
                          : 'Chọn phòng ban'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandEmpty>Không tìm thấy phòng ban</CommandEmpty>
                      <CommandGroup>
                        {departmentListFilterByCompanyKey.map((department) => (
                          <CommandItem
                            value={department}
                            key={department}
                            onSelect={() => {
                              form.setValue('department', department);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                department === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {department}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center">
                  {form.formState.errors.firstName ? (
                    <FormLabel>
                      Họ {form.formState.errors.firstName.message}
                    </FormLabel>
                  ) : (
                    <FormLabel disableError>Họ</FormLabel>
                  )}
                </div>
                <FormControl>
                  <Input className="w-full" placeholder="Nguyễn" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center">
                  {form.formState.errors.lastName ? (
                    <FormLabel>
                      Tên {form.formState.errors.lastName.message}
                    </FormLabel>
                  ) : (
                    <FormLabel disableError>Tên</FormLabel>
                  )}
                </div>
                <FormControl>
                  <Input className="w-full" placeholder="Văn Nam" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="software"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center">
                  {form.formState.errors.lastName ? (
                    <FormLabel>
                      Phần mềm chuyên ngành{' '}
                      {form.formState.errors.lastName.message}
                    </FormLabel>
                  ) : (
                    <FormLabel disableError>Phần mềm chuyên ngành</FormLabel>
                  )}
                </div>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder={`Xin hãy ghi theo template sau:
- Phần mềm 1
- Phần mềm 2

Ví dụ:
- Autocad
- Etab
- Smartpro
- Adobe Photoshop
`}
                    rows={10}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="w-[150px]"
            disabled={!systemInfo || mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {!systemInfo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {systemInfo && !mutation.isPending && !mutation.isSuccess && (
              <>
                <Send className="mr-2 h-4 w-4" /> Cập nhật
              </>
            )}

            {(mutation.isPending || mutation.isSuccess) && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppRoute />} />
      </Routes>
    </Router>
  );
}
