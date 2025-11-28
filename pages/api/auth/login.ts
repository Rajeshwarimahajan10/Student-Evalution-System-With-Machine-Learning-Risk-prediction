import { NextApiRequest, NextApiResponse } from 'next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is authorized
    const authorizedTeachers = [
      'mahajanrajeshwari10@gmail.com',
      'nimbalkarsakshi3@gmail.com',
      'pushkarrajput108@gmail.com',
      'kunalkothawade188@gmail.com',
      'samikshap929@gmail.com'
    ];

    const authorizedStudents = [
      'mariabrown@gmail.com',
      'omarwilliam@gmail.com',
      'johnsmith@gmail.com',
      'liambrown@gmail.com',
      'ahmedjones@gmail.com',
      'ahmedsmith@gmail.com',
      'omarsmith@gmail.com',
      'sarasmith@gmail.com',
      'johnsmith9@gmail.com',
      'johndavis@gmail.com',
      'johnwilliams@gmail.com',
      'liamwilliams@gmail.com',
      'mariajones@gmail.com',
      'liamdavis@gmail.com',
      'liamjones@gmail.com',
      'johnjohnson@gmail.com',
      'emmadavis@gmail.com',
      'ahmedjones@ugmail.com',
      'saradavis@gmail.com',
      'mariawilliams@university.com',
      'emmajohnson@gmail.com',
      'sarajohnson@gmail.com',
      'ahmedbrown@gmail.com',
      'alijohnson@gmail.com',
      'mariasmith@gmail.com',
      'sarawilliams@gmail.com',
      'ammadavis@gmail.com',
      'ahmedsmith@ugmail.com',
      'mariadavis@gmail.com',
      'aliwilliams@gmail.com'
    ];

    let userRole = null;
    if (authorizedTeachers.includes(email)) {
      userRole = 'teacher';
    } else if (authorizedStudents.includes(email)) {
      userRole = 'student';
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        role: userRole
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
}
