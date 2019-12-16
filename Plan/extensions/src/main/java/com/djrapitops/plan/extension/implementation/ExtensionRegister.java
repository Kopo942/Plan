/*
 *  This file is part of Player Analytics (Plan).
 *
 *  Plan is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License v3 as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Plan is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with Plan. If not, see <https://www.gnu.org/licenses/>.
 */
package com.djrapitops.plan.extension.implementation;

import com.djrapitops.extension.*;
import com.djrapitops.plan.extension.Caller;
import com.djrapitops.plan.extension.DataExtension;
import com.djrapitops.plan.extension.ExtensionService;
import com.djrapitops.plan.extension.NotReadyException;
import com.djrapitops.plan.extension.extractor.ExtensionExtractor;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * In charge of registering built in {@link com.djrapitops.plan.extension.DataExtension} implementations.
 *
 * @author Rsl1122
 */
@Singleton
public class ExtensionRegister {

    private final Function<String, Boolean> isExtensionEnabledInConfig;
    private IllegalStateException registerException;
    private Set<String> disabledExtensions;
    private ExtensionService extensionService;

    @Inject
    public ExtensionRegister(@Named("isExtensionEnabled") Function<String, Boolean> isExtensionEnabledInConfig) {
        /* Required for dagger injection */
        this.isExtensionEnabledInConfig = isExtensionEnabledInConfig;
    }

    public void registerBuiltInExtensions(Set<String> disabledExtensions) {
        this.disabledExtensions = disabledExtensions;
        extensionService = ExtensionService.getInstance();

        register(new AACExtensionFactory(), AACExtensionFactory::createExtension);
        register(new AdvancedAchievementsExtensionFactory(), AdvancedAchievementsExtensionFactory::createExtension);
        register(new AdvancedBanExtensionFactory(), AdvancedBanExtensionFactory::createExtension, AdvancedBanExtensionFactory::registerListener);
        register(new ASkyBlockExtensionFactory(), ASkyBlockExtensionFactory::createExtension);
        register(new BanManagerExtensionFactory(), BanManagerExtensionFactory::createExtension);
        register(new BuycraftExtensionFactory(), BuycraftExtensionFactory::createExtension);
//        register(new CoreProtectExtensionFactory(), CoreProtectExtensionFactory::createExtension);
        register(new DiscordSRVExtensionFactory(), DiscordSRVExtensionFactory::createExtension, DiscordSRVExtensionFactory::registerListener);
        register(new DKBansExtensionFactory(), DKBansExtensionFactory::createExtension, DKBansExtensionFactory::registerListener);
        register(new DKCoinsExtensionFactory(), DKCoinsExtensionFactory::createExtension, DKCoinsExtensionFactory::registerListener);
        register(new EssentialsExtensionFactory(), EssentialsExtensionFactory::createExtension, EssentialsExtensionFactory::registerUpdateListeners);
        register(new FactionsExtensionFactory(), FactionsExtensionFactory::createExtension);
        register(new GriefDefenderExtensionFactory(), GriefDefenderExtensionFactory::createExtension);
        register(new GriefPreventionExtensionFactory(), GriefPreventionExtensionFactory::createExtension);
        register(new GriefPreventionSpongeExtensionFactory(), GriefPreventionSpongeExtensionFactory::createExtension);
        register(new GriefPreventionPlusExtensionFactory(), GriefPreventionPlusExtensionFactory::createExtension);
        register(new JobsExtensionFactory(), JobsExtensionFactory::createExtension);
        register(new LitebansExtensionFactory(), LitebansExtensionFactory::createExtension, LitebansExtensionFactory::registerEvents);
        register(new LuckPermsExtensionFactory(), LuckPermsExtensionFactory::createExtension);
        register(new McMMOExtensionFactory(), McMMOExtensionFactory::createExtension);
        registerMinigameLibExtensions();
        register(new NucleusExtensionFactory(), NucleusExtensionFactory::createExtension);
        register(new NuVotifierExtensionFactory(), NuVotifierExtensionFactory::createExtension);
        register(new ProtocolSupportExtensionFactory(), ProtocolSupportExtensionFactory::createExtension);
        register(new RedProtectExtensionFactory(), RedProtectExtensionFactory::createExtension);
        register(new SpongeEconomyExtensionFactory(), SpongeEconomyExtensionFactory::createExtension);
        register(new SuperbVoteExtensionFactory(), SuperbVoteExtensionFactory::createExtension);
        register(new TownyExtensionFactory(), TownyExtensionFactory::createExtension);
        register(new VaultExtensionFactory(), VaultExtensionFactory::createExtension);
        register(new ViaVersionExtensionFactory(), ViaVersionExtensionFactory::createExtension);

        if (registerException != null) throw registerException;
    }

    private void registerMinigameLibExtensions() {
        for (DataExtension minigame : new MinigameLibExtensionFactory().createExtensions()) {
            register(minigame);
        }
    }

    private void suppressException(Class factory, Throwable e) {
        String factoryName = factory.getSimpleName();
        String extensionName = factoryName.replace("ExtensionFactory", "");

        if (!isExtensionEnabledInConfig.apply(extensionName)) {
            return;
        }

        // Places all exceptions to one exception with plugin information so that they can be reported.
        if (registerException == null) {
            registerException = new IllegalStateException("One or more extensions failed to register:");
            registerException.setStackTrace(new StackTraceElement[0]);
        }
        IllegalStateException info = new IllegalStateException(factoryName + " failed to create Extension", e);
        removeUselessStackTraces(info);
        registerException.addSuppressed(info);
    }

    private void removeUselessStackTraces(Throwable t) {
        if (t == null) return;
        if (t instanceof ReflectiveOperationException
                || t instanceof NoClassDefFoundError
                || t instanceof NoSuchFieldError
                || t instanceof NoSuchMethodError
                || t instanceof IllegalStateException
        ) {
            t.setStackTrace(new StackTraceElement[0]);
        }
        removeUselessStackTraces(t.getCause());
    }

    private <T> void register(
            T factory,
            Function<T, Optional<DataExtension>> createExtension
    ) {
        try {
            // Creates the extension with factory and registers it
            createExtension.apply(factory).ifPresent(this::register);
        } catch (NotReadyException ignore) {
            // This exception signals that the extension can not be registered right now (Intended fail).
        } catch (Exception | NoClassDefFoundError | IncompatibleClassChangeError e) {
            // Places all exceptions to one exception with plugin information so that they can be reported.
            suppressException(factory.getClass(), e);
        }
    }

    private <T> void register(
            T factory,
            Function<T, Optional<DataExtension>> createExtension,
            BiConsumer<T, Caller> registerListener
    ) {
        try {
            // Creates the extension with factory and registers it, then registers listener
            createExtension.apply(factory)
                    .flatMap(this::register)
                    .ifPresent(caller -> registerListener.accept(factory, caller));
        } catch (NotReadyException ignore) {
            // This exception signals that the extension can not be registered right now (Intended fail).
        } catch (Exception | NoClassDefFoundError | IncompatibleClassChangeError e) {
            // Places all exceptions to one exception with plugin information so that they can be reported.
            suppressException(factory.getClass(), e);
        }
    }

    private Optional<Caller> register(DataExtension dataExtension) {
        String extensionName = ExtensionExtractor.getPluginName(dataExtension.getClass());
        if (disabledExtensions.contains(extensionName)) return Optional.empty();

        return extensionService.register(dataExtension);
    }
}