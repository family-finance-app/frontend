'use client';

import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { roboto } from '@/assets/fonts/fonts';

import {
  FormActions,
  FormInput,
  FormSelectList,
  SuccessMessage,
  ErrorMessage,
} from '@/components';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  value?: string | number;
  onChange?: (value: string) => void;
}

interface EditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  title: string;
  fields: FormField[];
  initialData?: T;
  isLoading?: boolean;
  validateForm?: (data: T) => Partial<Record<keyof T, string>>;
  children?: ReactNode;
}

export default function EditModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData,
  isLoading = false,
  validateForm,
  children,
}: EditModalProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<T>({} as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setErrors({});
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen, initialData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof T]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (validateForm) {
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setErrorMessage('Please fix the validation errors');
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSubmit(formData);
      setSuccessMessage('Changes saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save changes. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name as keyof T] ?? '';
    const error = errors[field.name as keyof T];

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name}>
            <FormSelectList
              label={{ type: field.name, text: field.label }}
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              options={field.options || []}
              placeholder={field.label}
              error={error}
            />
          </div>
        );

      case 'text':
      case 'textarea':
      case 'number':
      case 'date':
        return (
          <div key={field.name}>
            <FormInput
              label={{ type: field.name, text: field.label }}
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={error}
              classname="internal"
            />
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <FormInput
              label={{ type: field.name, text: field.label }}
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={error}
              classname="internal"
            />
          </div>
        );
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-101">
        <div className="sticky top-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              className={`${roboto.className} text-xl font-semibold text-primary-800`}
            >
              {title}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* {successMessage && <SuccessMessage message={successMessage} />}

          {errorMessage && <ErrorMessage message={errorMessage} />} */}

          {fields.map((field) => renderField(field))}

          {children}

          <div className="flex gap-3 pt-4">
            <FormActions onCancel={onClose} />
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
