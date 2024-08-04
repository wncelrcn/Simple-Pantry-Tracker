'use client'
import { useState, useEffect } from "react";
import { firestore, storage } from "@/firebase";
import { Box, Typography, Modal, Button, Stack, TextField, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import NavBar from "@/components/NavBar";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
  }

  const subtractItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }

    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      if (!itemImage) {
        alert('Please upload an image for the new item.');
        return;
      }

      const storageRef = ref(storage, `images/${item}`);
      await uploadBytes(storageRef, itemImage);
      const imageUrl = await getDownloadURL(storageRef);

      await setDoc(docRef, { quantity: 1, imageUrl });
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <NavBar/>
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" padding={2} bgcolor="#f7f7f7">
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" borderRadius={2} boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6" textAlign="center">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item Name" />
          </Stack>
          <Stack width="100%" direction="row" spacing={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden onChange={(e) => setItemImage(e.target.files[0])} />
            </Button>
            <Button variant="contained" color="primary" onClick={() => { addItem(itemName); setItemName(''); setItemImage(null); handleClose(); }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="80%" marginBottom={2}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>Add New Item</Button>
        <TextField variant="outlined" placeholder="Search for Items" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Box>
      <Paper elevation={3} sx={{ width: '80%', padding: 2, bgcolor: '#e3f2fd' }}>
        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
          <Typography variant="h4" color="#333">Pantry Items</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '25%' }}>Image</TableCell>
                <TableCell sx={{ width: '25%' }}>Item Name</TableCell>
                <TableCell align="center" sx={{ width: '25%' }}>Quantity</TableCell>
                <TableCell align="right" sx={{ width: '25%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map(({ name, quantity, imageUrl }) => (
                  <TableRow key={name}>
                    <TableCell>
                      {imageUrl && <img src={imageUrl} alt={name} style={{ width: '50px', height: '50px' }} />}
                    </TableCell>
                    <TableCell>{name.charAt(0).toUpperCase() + name.slice(1)}</TableCell>
                    <TableCell align="center">{quantity}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => addItem(name)}><AddIcon /></IconButton>
                      <IconButton color="primary" onClick={() => subtractItem(name)}><RemoveIcon /></IconButton>
                      <IconButton color="secondary" onClick={() => removeItem(name)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">There are no items in the pantry.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
    </>
  );
}
