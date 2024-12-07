'use server';

import db from '@/db';
import {PageSchema} from '@/types';


export const getPages = async (userId) => {
    try{
        const id = await db.User.findFirst({
            where: {
                userId,
            },
        });
        const pages = await db.Note.findMany({
            where: {
                userId : id.id,
            },
        });
        return pages;
    } catch(error){
        console.log('error on getPages:', error);
        return {error: error.message};
    }
}
    

export const createOrUpdatePage = async (formData) => {
    const id = parseInt(formData.get('id'), 10);
    const title = formData.get('title');
    const contents = formData.get('contents');
    const data = {title, contents};
    const result = PageSchema.safeParse(data);
    if(!result.success){
        let errorMessages = "";
        result.error.errors.forEach((error) => {
            errorMessages += error.message + "\n";
        });
        console.log(errorMessages);
        return {error: errorMessages};
    }

    try{
        if (!id){
            await db.Note.create({data});
        }
        else{
            await db.Note.update({
                where: {id},
                data,
            });
        }
    } catch(error){
        return {error: error.message};
    }
};

export const createPage = async (userId) => {
  try {
    // userId 문자열을 사용하여 User.id 조회
    const user = await db.user.findFirst({
      where: { userId },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    // User.id를 사용하여 Note 생성
    const newNote = await db.note.create({
      data: {
        title: "New Note",
        contents: "",
        author: {
          connect: { id: user.id }, // User.id로 연결
        },
      },
    });

    return newNote;
  } catch (error) {
    return { error: error.message };
  }
};

export const deletePage = async (id) => {
    try {
        await db.Note.delete({
            where: { id },
        });
    } catch (error) {
        return { error: error.message };
    }
};

export const login = async (formData) => {
    const userId = formData.get('userId');
    const password = formData.get('password');
    const data = {userId, password};
    try{
        const user = await db.User.findFirst({
            where: {
                userId,
            },
        });
        if (!user || user.password !== password){
            throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
        return user;
    }
    catch(error){
        return {error: error.message};
    }
};

export const logout = async () => {
    return null;
};

export const register = async (formData) => {
    const userId = formData.get('userId');
    const password = formData.get('password');
    const data = {userId, password};
    try{
        const result = await db.User.findFirst({
            where: {
                userId,
            },
        });
        if(result){
            throw new Error('이미 존재하는 아이디입니다.');
        }
        const newUser = await db.User.create({data});
        return newUser;
    }
    catch(error){
        return {success: false, message: error.message};
    }
};

export const updateNoteFavorite = async (favorite, id) => {
    try{
        const data = {favorite};
        await db.Note.update({
            where: {id},
            data: {favorite},
        });
    } catch(error){
        return {error: error.message};
    }
}