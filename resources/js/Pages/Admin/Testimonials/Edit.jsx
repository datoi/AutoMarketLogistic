import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TestimonialForm from './TestimonialForm';

export default function Edit({ testimonial }) {
    const form = useForm({
        name:          testimonial.name,
        city:          testimonial.city ?? '',
        vehicle_label: testimonial.vehicle_label ?? '',
        quote:         testimonial.quote,
        rating:        testimonial.rating,
        is_active:     !!testimonial.is_active,
        sort_order:    String(testimonial.sort_order ?? 0),
        photo:         null,
        keep_photo:    true,
    });

    const submit = (e) => {
        e.preventDefault();
        // Same _method spoofing trick as VehicleForm.Edit — file uploads on PUT need
        // POST + `_method=put` because browsers can't send multipart over PUT.
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.testimonials.update', testimonial.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('admin.testimonials.index')} className="text-gray-500 hover:text-gray-700">← Testimonials</Link>
                <span className="text-gray-300">/</span>
                <h2 className="text-xl font-semibold text-gray-800">Edit Testimonial</h2>
            </div>
        }>
            <Head title="Edit Testimonial" />
            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TestimonialForm
                        form={form}
                        onSubmit={submit}
                        submitLabel="Save Changes"
                        existingPhotoUrl={testimonial.photo_url}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
