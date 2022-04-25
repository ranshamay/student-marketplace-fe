import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoIcon from "@mui/icons-material/Info";
import {
  Grid,
  Button,
  Paper,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as routes from "../../tools/api/routes";
import { Service } from "../../types/types";
import BootstrapDialogTitle from "../../components/dialogTitle";
import Link from "next/link";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function ItemPage() {
  const [session, loading] = useSession();

  const [getItemDesc, setItemDesc] = useState<Service>({
    id: "",
    image: "",
    price: 0,
    rating: 0,
    serviceGroup: "",
    title: "",
    description: "",
    sellerDesc: "",
    sellerPhone: "",
  });
  const [purchaseStatus, setPurchaseStatus] = useState<Boolean>(false);
  const [open, setOpen] = useState<Boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function getItemDescription() {
      const itemDescription = await routes.getService({
        itemId: id as string,
      });
      setItemDesc(itemDescription);
    }
    getItemDescription();
  }, [id]);
  const purchase = async () => {
    const purchaseResult = await routes.postPurchase({
      buyerId: session?.user.googleId as string,
      itemId: id as string,
      quantity: 1,
    });

    if (purchaseResult.status === 201) {
      setPurchaseStatus(true);
    }
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid container item direction={"column"} xs>
          <Grid item>
            <Typography variant="h2">{getItemDesc.title}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">{getItemDesc.description}</Typography>
          </Grid>
          <Grid container item justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Typography variant="h5">{getItemDesc.price}</Typography>
            </Grid>
            <Grid item>
              <AttachMoneyIcon />
            </Grid>
          </Grid>
          <Grid item>
            <Rating defaultValue={getItemDesc.rating} />
          </Grid>
        </Grid>
        <Grid item xs>
          <Card>
            <CardMedia
              component="img"
              height="600"
              image={getItemDesc.image}
              alt={getItemDesc.title}
            />
          </Card>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container direction={"column"}>
          <Grid item>
            <Typography variant="h5">About the seller</Typography>
          </Grid>
          <Grid container item alignItems={"center"}>
            <IconButton aria-label="add to favorites">
              <InfoIcon />
            </IconButton>
            <Typography>{getItemDesc.sellerDesc}</Typography>
          </Grid>
          <Grid container item alignItems={"center"}>
            <IconButton aria-label="add to favorites">
              <LocalPhoneIcon />
            </IconButton>
            <Typography>{getItemDesc.sellerPhone}</Typography>
          </Grid>
          <Grid container item alignItems={"center"}>
            <Button variant="contained" onClick={purchase}>
              Purchase
            </Button>
          </Grid>
        </Grid>
        <Grid></Grid>
      </Grid>

      <Dialog open={open === true} disableEscapeKeyDown={false}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => handleClose()}
        >
          Your purchase completed successfully
        </BootstrapDialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Purchase Details:
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Product/Service Name: {getItemDesc.title}
          </Typography>
          <Typography variant="h6">
            Seller Description: {getItemDesc.sellerDesc}
          </Typography>
          <Typography variant="h6">Price: {getItemDesc.price}</Typography>
        </DialogContent>
        <DialogActions>
          <Link href="/" passHref>
            <Button>Back to main page</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
