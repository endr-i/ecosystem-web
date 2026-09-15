import { AuthLayout } from '../../../layouts/AuthLayout';
import { ResetConfirmForm } from '../components/ResetConfirmForm';

export function ResetConfirmPage() {
    return (
        <AuthLayout
            title="Reset Password"
        >
            <ResetConfirmForm />
        </AuthLayout>
    );
}
