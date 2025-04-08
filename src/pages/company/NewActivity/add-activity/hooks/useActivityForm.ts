import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Activity, 
  ActivityType, 
  ActivityPriority, 
  ActivityStatus, 
  ActivityAvailability,
  VideoCallPlatform,
  RecurrencePattern,
  Reminder,
  Comment,
  ActivityTag
} from "@/types/activity";

export const useActivityForm = (contactId?: string) => {
  // Basic activity fields
  const [type, setType] = useState<ActivityType>("call");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<ActivityPriority>("medium");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [availability, setAvailability] = useState<ActivityAvailability>("busy");
  const [status, setStatus] = useState<ActivityStatus>("scheduled");
  
  // Video call related fields
  const [videoCallPlatform, setVideoCallPlatform] = useState<VideoCallPlatform>("none");
  const [videoCallUrl, setVideoCallUrl] = useState("");
  
  // Association fields
  const [contacts, setContacts] = useState<string[]>(contactId ? [contactId] : []);
  const [deals, setDeals] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  
  // Recurrence fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>("weekly");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(undefined);
  const [recurrenceCount, setRecurrenceCount] = useState<number | undefined>(undefined);
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  
  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  // Tags
  const [tags, setTags] = useState<ActivityTag[]>([]);
  
  // Tasks
  const [tasks, setTasks] = useState<Array<{
    id: string;
    title: string;
    completed: boolean;
  }>>([]);
  
  // Participants for meetings
  const [participants, setParticipants] = useState<Array<{
    id: string;
    name: string;
    email: string;
    external: boolean;
  }>>([]);

  // Custom fields
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  // Service appointment specific fields
  const [patientBalance, setPatientBalance] = useState<number>(0);
  const [paperworkCompleted, setPaperworkCompleted] = useState<boolean>(false);
  const [assignedServices, setAssignedServices] = useState<Array<{ id: string; name: string; price?: number }>>([]);
  const [assignedProducts, setAssignedProducts] = useState<Array<{ id: string; name: string; quantity: number; price?: number }>>([]);
  const [servicesOfInterest, setServicesOfInterest] = useState<Array<{ id: string; name: string; notes?: string }>>([]);
  const [productsOfInterest, setProductsOfInterest] = useState<Array<{ id: string; name: string; quantity: number; notes?: string }>>([]);

  // Add a participant
  const addParticipant = useCallback(() => {
    setParticipants(prev => [
      ...prev, 
      { id: uuidv4(), name: "", email: "", external: false }
    ]);
  }, []);

  // Remove a participant
  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  // Update a participant
  const updateParticipant = useCallback((id: string, field: string, value: any) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  }, []);
  
  // Add a comment
  const addComment = useCallback((text: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      author: "Current User", // In a real app, get this from auth context
      text,
      timestamp: new Date()
    };
    setComments(prev => [...prev, newComment]);
  }, []);
  
  // Remove a comment
  const removeComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);
  
  // Add a reminder
  const addReminder = useCallback((time: number, type: "email" | "notification" | "sms" = "notification") => {
    const newReminder: Reminder = {
      id: uuidv4(),
      time,
      type
    };
    setReminders(prev => [...prev, newReminder]);
  }, []);
  
  // Remove a reminder
  const removeReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);
  
  // Add a tag
  const addTag = useCallback((name: string, color: string = "#3b82f6") => {
    const newTag: ActivityTag = {
      id: uuidv4(),
      name,
      color
    };
    setTags(prev => [...prev, newTag]);
  }, []);
  
  // Remove a tag
  const removeTag = useCallback((id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);
  
  // Add a task
  const addTask = useCallback((title: string) => {
    const newTask = {
      id: uuidv4(),
      title,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  }, []);
  
  // Remove a task
  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);
  
  // Update a task
  const updateTask = useCallback((id: string, field: string, value: any) => {
    setTasks(prev => 
      prev.map(t => t.id === id ? { ...t, [field]: value } : t)
    );
  }, []);

  // Add a custom field
  const addCustomField = useCallback((key: string, value: any) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Service appointment methods
  const addAssignedService = useCallback((service: { id: string; name: string; price?: number }) => {
    setAssignedServices(prev => [...prev, service]);
  }, []);

  const removeAssignedService = useCallback((id: string) => {
    setAssignedServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const addAssignedProduct = useCallback((product: { id: string; name: string; quantity: number; price?: number }) => {
    setAssignedProducts(prev => [...prev, product]);
  }, []);

  const removeAssignedProduct = useCallback((id: string) => {
    setAssignedProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addServiceOfInterest = useCallback((service: { id: string; name: string; notes?: string }) => {
    setServicesOfInterest(prev => [...prev, service]);
  }, []);

  const removeServiceOfInterest = useCallback((id: string) => {
    setServicesOfInterest(prev => prev.filter(s => s.id !== id));
  }, []);

  const addProductOfInterest = useCallback((product: { id: string; name: string; quantity: number; notes?: string }) => {
    setProductsOfInterest(prev => [...prev, product]);
  }, []);

  const removeProductOfInterest = useCallback((id: string) => {
    setProductsOfInterest(prev => prev.filter(p => p.id !== id));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setType("call");
    setTitle("");
    setStartDate(new Date());
    setDueDate(new Date());
    setStartTime("");
    setDueTime("");
    setPriority("medium");
    setDescription("");
    setOwner("");
    setAvailability("busy");
    setStatus("scheduled");
    setVideoCallPlatform("none");
    setVideoCallUrl("");
    setContacts(contactId ? [contactId] : []);
    setDeals([]);
    setProjects([]);
    setOrganizations([]);
    setUsers([]);
    setIsRecurring(false);
    setRecurrencePattern("weekly");
    setRecurrenceEndDate(undefined);
    setRecurrenceCount(undefined);
    setRecurrenceDays([]);
    setComments([]);
    setReminders([]);
    setTags([]);
    setTasks([]);
    setParticipants([]);
    setCustomFields({});
    
    setPatientBalance(0);
    setPaperworkCompleted(false);
    setAssignedServices([]);
    setAssignedProducts([]);
    setServicesOfInterest([]);
    setProductsOfInterest([]);
  }, [contactId]);

  // Get form data as Activity object
  const getFormData = useCallback((): Activity => {
    return {
      id: uuidv4(),
      type,
      title,
      startDate,
      dueDate,
      startTime,
      dueTime,
      priority,
      description,
      owner,
      availability,
      status,
      videoCallPlatform,
      videoCallUrl,
      associatedDeals: deals,
      associatedProjects: projects,
      associatedOrganizations: organizations,
      associatedUsers: users,
      isRecurring,
      recurrencePattern,
      recurrenceEndDate,
      recurrenceCount,
      recurrenceDays,
      comments,
      reminders,
      tags,
      tasks,
      participants: participants.map(({ name, email, external }) => ({ name, email, external })),
      
      clientDetails: type === "service appointment" ? {
        patientBalance,
        paperworkCompleted
      } : undefined,
      assignedServices: type === "service appointment" ? assignedServices : undefined,
      assignedProducts: type === "service appointment" ? assignedProducts : undefined,
      servicesOfInterest: type === "service appointment" ? servicesOfInterest : undefined,
      productsOfInterest: type === "service appointment" ? productsOfInterest : undefined
    };
  }, [
    type, title, startDate, dueDate, startTime, dueTime, priority,
    description, owner, availability, status, videoCallPlatform,
    videoCallUrl, deals, projects, organizations, users,
    isRecurring, recurrencePattern, recurrenceEndDate, recurrenceCount, recurrenceDays,
    comments, reminders, tags, tasks, participants,
    patientBalance, paperworkCompleted, assignedServices, assignedProducts,
    servicesOfInterest, productsOfInterest
  ]);

  return {
    // Form state
    type,
    title,
    startDate,
    dueDate,
    startTime,
    dueTime,
    priority,
    description,
    owner,
    availability,
    status,
    videoCallPlatform,
    videoCallUrl,
    contacts,
    deals,
    projects,
    organizations,
    users,
    isRecurring,
    recurrencePattern,
    recurrenceEndDate,
    recurrenceCount,
    recurrenceDays,
    comments,
    reminders,
    tags,
    tasks,
    participants,
    customFields,
    
    // Form setters
    setType,
    setTitle,
    setStartDate,
    setDueDate,
    setStartTime,
    setDueTime,
    setPriority,
    setDescription,
    setOwner,
    setAvailability,
    setStatus,
    setVideoCallPlatform,
    setVideoCallUrl,
    setContacts,
    setDeals,
    setProjects,
    setOrganizations,
    setUsers,
    setIsRecurring,
    setRecurrencePattern,
    setRecurrenceEndDate,
    setRecurrenceCount,
    setRecurrenceDays,
    
    // Participant methods
    addParticipant,
    removeParticipant,
    updateParticipant,
    
    // Comment methods
    addComment,
    removeComment,
    
    // Reminder methods
    addReminder,
    removeReminder,
    
    // Tag methods
    addTag,
    removeTag,
    
    // Task methods
    addTask,
    removeTask,
    updateTask,
    
    // Custom field methods
    addCustomField,
    
    // Service appointment methods
    addAssignedService,
    removeAssignedService,
    addAssignedProduct,
    removeAssignedProduct,
    addServiceOfInterest,
    removeServiceOfInterest,
    addProductOfInterest,
    removeProductOfInterest,
    
    // Form actions
    resetForm,
    getFormData
  };
};
