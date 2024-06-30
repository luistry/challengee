import { useSupabase } from './Supabase';

export const signInUser = async (email, password) => {
  const supabase = useSupabase();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    throw error;
  }
};


export const signUpUser = async (email, password, name) => {
  const supabase = useSupabase();
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Error al registrarse con Supabase Auth:', error.message);
      throw error;
    }

    const { data: insertData, error: insertError } = await supabase
      .from('Users')
      .insert([{ id: data.user.id, email, name, created_at: new Date() }]);
    if (insertError) {
      console.error('Error al insertar usuario en la base de datos:', insertError.message);
      throw insertError;
    }
    console.log('Usuario registrado correctamente:', insertData);
    return insertData;
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    throw error;
  }
};


export const checkSession = async () => {
  const supabase = useSupabase();
  try {
    const user = supabase.auth.user();
    return user;
  } catch (error) {
    console.error('Error al obtener la sesión:', error.message);
    throw error;
  }
};

export const getUsers = async () => {
  const supabase = useSupabase();
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*');
    if (error) {
      throw error;
    }
    console.log('Datos de usuarios:', data); 
    return data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    throw error;
  }
};


export const sendOtp = async (email) => {
  const supabase = useSupabase();
  try {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error al enviar el correo con OTP:', error.message);
    throw error;
  }
};


export const getUserByEmail = async (email) => {
  const supabase = useSupabase();
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('name, email')
      .eq('email', email)
      .single();

    if (error) {
      throw error;
    }

    return data; 
  } catch (error) {
    console.error('Error al obtener usuario por email:', error.message);
    throw error;
  }
};

export default {
  signInUser,
  signUpUser,
  checkSession,
  getUsers,
  sendOtp,
  getUserByEmail,
};
