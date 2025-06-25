
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ArrowLeft, ShoppingBag, Check, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/layout/Layout';

const checkoutSchema = z.object({
  nom_customer: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom_customer: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email_customer: z.string().email('Adresse email invalide'),
  telephone_customer: z.string().min(8, 'Numéro de téléphone invalide'),
  adresse_customer: z.string().min(5, 'Adresse complète requise'),
  ville_customer: z.string().min(2, 'Ville requise'),
  code_postal_customer: z.string().min(4, 'Code postal requis'),
  pays_customer: z.string().min(2, 'Pays requis'),
  notes_order: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pays_customer: 'Tunisie'
    }
  });

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} TND`;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!deliveryDate) {
      alert('Veuillez sélectionner une date de livraison');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Order submitted:', {
        ...data,
        date_livraison_souhaitee: deliveryDate,
        items,
        total: getTotalPrice()
      });

      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits à votre panier avant de passer commande.</p>
            <Button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 text-white">
              Continuer vos achats
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (orderSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-serif text-gray-900 mb-4">Commande confirmée !</h1>
                <p className="text-gray-600 mb-8">
                  Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.
                </p>
                <Button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 text-white">
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const steps = [
    { number: 1, title: 'Informations personnelles' },
    { number: 2, title: 'Livraison' },
    { number: 3, title: 'Paiement' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-serif text-gray-900">Finaliser votre commande</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    step.number <= currentStep 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-gray-500 border-gray-300"
                  )}>
                    {step.number}
                  </div>
                  <span className={cn(
                    "ml-3 text-sm font-medium hidden sm:inline",
                    step.number <= currentStep ? "text-slate-900" : "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-px mx-6",
                    step.number < currentStep ? "bg-slate-900" : "bg-gray-300"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h2 className="text-xl font-serif text-gray-900 mb-2">Informations personnelles</h2>
                          <p className="text-gray-600 text-sm">Veuillez remplir vos informations de contact</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="prenom_customer" className="text-gray-700 font-medium">Prénom *</Label>
                            <Input
                              id="prenom_customer"
                              {...register('prenom_customer')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder="Votre prénom"
                            />
                            {errors.prenom_customer && (
                              <p className="text-sm text-red-600">{errors.prenom_customer.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nom_customer" className="text-gray-700 font-medium">Nom *</Label>
                            <Input
                              id="nom_customer"
                              {...register('nom_customer')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder="Votre nom"
                            />
                            {errors.nom_customer && (
                              <p className="text-sm text-red-600">{errors.nom_customer.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email_customer" className="text-gray-700 font-medium">Email *</Label>
                          <Input
                            id="email_customer"
                            type="email"
                            {...register('email_customer')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            placeholder="votre@email.com"
                          />
                          {errors.email_customer && (
                            <p className="text-sm text-red-600">{errors.email_customer.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telephone_customer" className="text-gray-700 font-medium">Téléphone *</Label>
                          <Input
                            id="telephone_customer"
                            {...register('telephone_customer')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            placeholder="+216 XX XXX XXX"
                          />
                          {errors.telephone_customer && (
                            <p className="text-sm text-red-600">{errors.telephone_customer.message}</p>
                          )}
                        </div>

                        <div className="flex justify-end pt-6">
                          <Button 
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
                          >
                            Continuer
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h2 className="text-xl font-serif text-gray-900 mb-2">Adresse de livraison</h2>
                          <p className="text-gray-600 text-sm">Où souhaitez-vous recevoir votre commande ?</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="adresse_customer" className="text-gray-700 font-medium">Adresse complète *</Label>
                          <Textarea
                            id="adresse_customer"
                            {...register('adresse_customer')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            rows={3}
                            placeholder="Numéro, rue, quartier..."
                          />
                          {errors.adresse_customer && (
                            <p className="text-sm text-red-600">{errors.adresse_customer.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ville_customer" className="text-gray-700 font-medium">Ville *</Label>
                            <Input
                              id="ville_customer"
                              {...register('ville_customer')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder="Tunis"
                            />
                            {errors.ville_customer && (
                              <p className="text-sm text-red-600">{errors.ville_customer.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="code_postal_customer" className="text-gray-700 font-medium">Code postal *</Label>
                            <Input
                              id="code_postal_customer"
                              {...register('code_postal_customer')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder="1000"
                            />
                            {errors.code_postal_customer && (
                              <p className="text-sm text-red-600">{errors.code_postal_customer.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pays_customer" className="text-gray-700 font-medium">Pays *</Label>
                            <Input
                              id="pays_customer"
                              {...register('pays_customer')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            />
                            {errors.pays_customer && (
                              <p className="text-sm text-red-600">{errors.pays_customer.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">Date de livraison souhaitée *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50",
                                  !deliveryDate && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white" align="start">
                              <Calendar
                                mode="single"
                                selected={deliveryDate}
                                onSelect={setDeliveryDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes_order" className="text-gray-700 font-medium">Notes spéciales (optionnel)</Label>
                          <Textarea
                            id="notes_order"
                            {...register('notes_order')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            rows={3}
                            placeholder="Instructions spéciales pour la livraison..."
                          />
                        </div>

                        <div className="flex justify-between pt-6">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(1)}
                            className="px-8 py-3"
                          >
                            Retour
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
                          >
                            Continuer
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h2 className="text-xl font-serif text-gray-900 mb-2">Confirmation et paiement</h2>
                          <p className="text-gray-600 text-sm">Vérifiez vos informations avant de finaliser</p>
                        </div>

                        {/* Products List */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Vos produits</h3>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md bg-white"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Taille: {item.size} {item.color && `• ${item.color}`}
                                  </p>
                                  <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Card className="bg-gray-50 border-gray-200">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Résumé de livraison</h3>
                            <div className="text-sm text-gray-600 space-y-2">
                              <p><strong>Nom:</strong> {watch('prenom_customer')} {watch('nom_customer')}</p>
                              <p><strong>Email:</strong> {watch('email_customer')}</p>
                              <p><strong>Téléphone:</strong> {watch('telephone_customer')}</p>
                              <p><strong>Adresse:</strong> {watch('adresse_customer')}</p>
                              <p><strong>Ville:</strong> {watch('ville_customer')}, {watch('code_postal_customer')}</p>
                              <p><strong>Pays:</strong> {watch('pays_customer')}</p>
                              {deliveryDate && (
                                <p><strong>Date de livraison:</strong> {format(deliveryDate, "PPP", { locale: fr })}</p>
                              )}
                              {watch('notes_order') && (
                                <p><strong>Notes:</strong> {watch('notes_order')}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-between pt-6">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            className="px-8 py-3"
                          >
                            Retour
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 flex items-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            {isSubmitting ? 'Traitement...' : 'Confirmer et payer'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-sm sticky top-36">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-gray-900">Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Taille: {item.size} • Qté: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="text-gray-900">Gratuite</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
