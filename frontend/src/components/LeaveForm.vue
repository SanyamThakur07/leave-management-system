<template>
    <form
        @submit.prevent="handleSubmit"
        class="bg-white rounded-xl shadow-md p-6 border border-gray-200"
    >
        <div class="flex items-center space-x-3 mb-6">
            <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
                <svg
                    class="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Apply for Leave</h3>
        </div>

        <div class="space-y-5">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Leave Type</label
                >
                <div class="grid grid-cols-2 gap-3">
                    <button
                        v-for="type in leaveTypes"
                        :key="type.value"
                        type="button"
                        @click="formData.leaveType = type.value"
                        class="p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1"
                        :class="
                            formData.leaveType === type.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        "
                    >
                        <span class="text-xl">{{ type.icon }}</span>
                        <span class="text-xs font-medium">{{
                            type.label
                        }}</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Start Date</label
                    >
                    <VueDatePicker
                        ref="startDatePicker"
                        v-model="formData.startDate"
                        :enable-time-picker="false"
                        :format="'MMM dd, yyyy'"
                        :min-date="new Date()"
                        :auto-apply="true"
                        :clearable="false"
                        :hide-input-icon="true"
                        placeholder="Select start date"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >End Date</label
                    >
                    <VueDatePicker
                        ref="endDatePicker"
                        v-model="formData.endDate"
                        :enable-time-picker="false"
                        :time-picker="false"
                        :format="'MMM dd, yyyy'"
                        :min-date="formData.startDate || new Date()"
                        :auto-apply="true"
                        :clearable="false"
                        :hide-input-icon="true"
                        placeholder="Select end date"
                    />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Reason</label
                >
                <textarea
                    v-model="formData.reason"
                    required
                    rows="3"
                    maxlength="500"
                    placeholder="Describe the reason for your leave request..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                ></textarea>
                <p class="text-xs text-gray-400 mt-1 text-right">
                    {{ formData.reason.length }}/500
                </p>
            </div>

            <div
                v-if="error"
                class="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
                <span>{{ error }}</span>
            </div>

            <button
                type="submit"
                :disabled="loading || isSubmitting"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                <span
                    v-if="loading"
                    class="flex items-center justify-center space-x-2"
                >
                    <svg
                        class="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Submitting...</span>
                </span>
                <span v-else class="flex items-center justify-center space-x-2">
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                    <span>Submit Request</span>
                </span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useLeaveStore } from "../stores/leave";

const leaveStore = useLeaveStore();
const toast = inject("toast");

const leaveTypes = [
    { value: "sick", label: "Sick Leave", icon: "🤒" },
    { value: "vacation", label: "Vacation", icon: "🏖️" },
    { value: "personal", label: "Personal", icon: "👤" },
    { value: "other", label: "Other", icon: "📋" },
];

const formData = reactive({
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: "",
});

const startDatePicker = ref(null);
const endDatePicker = ref(null);

const loading = ref(false);
const error = ref("");
const isSubmitting = ref(false);

const resetForm = () => {
    formData.leaveType = "";
    formData.startDate = null;
    formData.endDate = null;
    formData.reason = "";
    if (startDatePicker.value) {
        startDatePicker.value.clearValue();
    }
    if (endDatePicker.value) {
        endDatePicker.value.clearValue();
    }
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleSubmit = async () => {
    error.value = "";

    if (!formData.leaveType) {
        error.value = "Please select a leave type";
        return;
    }

    if (!formData.startDate || !formData.endDate) {
        error.value = "Please select start and end dates";
        return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
        error.value = "End date must be after or equal to start date";
        return;
    }

    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    loading.value = true;
    error.value = "";
    try {
        const payload = {
            leaveType: formData.leaveType,
            startDate: formatDate(formData.startDate),
            endDate: formatDate(formData.endDate),
            reason: formData.reason,
        };
        await leaveStore.createLeave(payload);
        toast.addToast("Leave request submitted successfully!", "success");
        resetForm();
    } catch (err) {
        console.error('LeaveForm error:', err)
        console.error('LeaveForm error response:', err.response)
        console.error('LeaveForm error response data:', err.response?.data)
        error.value =
            err.response?.data?.message || "Failed to submit leave request";
    } finally {
        loading.value = false;
        isSubmitting.value = false;
    }
};
</script>

<style>
.dp-custom {
    --dp-font-family:
        "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
    --dp-border-radius: 8px;
    --dp-cell-border-radius: 8px;
}
.dp-custom .dp__input {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    height: 42px;
    padding: 0 12px;
}
.dp-custom .dp__input_focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.dp-custom .dp__menu {
    padding-bottom: 8px;
}
</style>
